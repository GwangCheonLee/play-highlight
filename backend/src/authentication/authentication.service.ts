import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './repositories/users.repository';
import { SignUpDto } from './dto/signUp.dto';
import { cryptPlainText } from '../common/common.constant';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const emailExists = await this.usersRepository.checkEmailExists(
      signUpDto.email,
    );

    if (emailExists) {
      throw new ConflictException(
        'This email is already registered. Please use another email.',
      );
    }

    const hashedPassword = await cryptPlainText(signUpDto.password);

    return await this.usersRepository.save({
      ...signUpDto,
      password: hashedPassword,
    });
  }

  generateAccessToken(user: Users) {
    return this.jwtService.sign(
      { user: this.extractPayloadFromUser(user) },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  async generateRefreshToken(user: Users) {
    return this.jwtService.sign(
      { user: this.extractPayloadFromUser(user) },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  private extractPayloadFromUser(user: Users) {
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };
  }
}
