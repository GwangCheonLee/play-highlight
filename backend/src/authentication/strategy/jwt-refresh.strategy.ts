import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { GuardTypeEnum } from './guard-type.enum';
import { TokenPayloadInterface } from '../interface/token-payload.interface';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  GuardTypeEnum.JWT_REFRESH,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayloadInterface) {
    return await this.usersRepository.getUserById(payload.user.id);
  }
}
