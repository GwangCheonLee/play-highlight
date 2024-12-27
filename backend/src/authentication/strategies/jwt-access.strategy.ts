import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GuardTypeEnum } from './guard-type.enum';
import { UserRepository } from '../../user/repositories/user.repository';
import { TokenPayloadInterface } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  GuardTypeEnum.JWT_ACCESS,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayloadInterface) {
    return await this.userRepository.getUserById(payload.user.id);
  }
}
