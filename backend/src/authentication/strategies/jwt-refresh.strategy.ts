import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { GuardTypeEnum } from '../enums/guard-type.enum';
import { UserRepository } from '../../user/repositories/user.repository';
import { TokenPayloadInterface } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  GuardTypeEnum.JWT_REFRESH,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
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
    return await this.userRepository.getUserById(payload.user.id);
  }
}
