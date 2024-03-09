import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './repositories/users.repository';
import { SignUpDto } from './dto/signUp.dto';
import { cryptPlainText } from '../common/common.constant';
import { Response } from 'express';

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

  async generateRefreshToken(user: Users, response: Response): Promise<void> {
    const jwtRefreshTokenExpirationTime = this.configService.get<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );

    const refreshToken = this.jwtService.sign(
      { user: this.extractPayloadFromUser(user) },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: jwtRefreshTokenExpirationTime * 1000,
      },
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: jwtRefreshTokenExpirationTime * 1000,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    });
  }

  async changeNickname(user: Users, nickname: string) {
    await this.usersRepository.update(user.id, { nickname });
    return this.usersRepository.findOneBy({ id: user.id });
  }

  private extractPayloadFromUser(user: Users) {
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };
  }
}
