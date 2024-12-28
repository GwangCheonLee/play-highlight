import { Strategy } from 'passport-jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { compareWithHashForSHA256 } from '../../common/constants/encryption.constant';
import { RedisService } from '../../redis/redis.service';
import { Request } from 'express';
import { GuardTypeEnum } from '../enums/guard-type.enum';
import { UserRepository } from '../../user/repositories/user.repository';
import { User } from '../../user/entities/user.entity';
import { ApplicationSettingKeyEnum } from '../../application-setting/enums/application-setting-key.enum';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  GuardTypeEnum.JWT_REFRESH,
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        if (req.cookies && req.cookies.refreshToken) {
          return req.cookies.refreshToken;
        }
        return null;
      },
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * JWT 리프레시 토큰을 검증하는 메서드입니다.
   *
   * @param {Request} req - Request 객체
   * @param {JwtPayloadInterface} payload - JWT 페이로드
   * @return {Promise<User>} - 검증된 유저 정보를 반환
   * @throws {UnauthorizedException} - 토큰이 유효하지 않으면 예외를 발생
   */
  async validate(req: Request, payload: JwtPayloadInterface): Promise<User> {
    const user: User = await this.userRepository.findOneUserById(
      payload.user.id,
    );

    const isPreventionEnabled: boolean =
      await this.redisService.getApplicationSetting(
        ApplicationSettingKeyEnum.DUPLICATE_LOGIN_PREVENTION,
      );

    if (isPreventionEnabled) {
      this.logger.debug(
        'Duplicate login prevention is enabled. Validating token...',
      );

      const storedHashedToken: string | null =
        await this.redisService.getUserHashedRefreshToken(user.id);

      if (!storedHashedToken) {
        this.logger.warn('Token mismatch: No stored token found.');
        throw new UnauthorizedException('Token mismatch.');
      }

      const userTokenByRequest = req.cookies.refreshToken;

      const isValidToken = compareWithHashForSHA256(
        userTokenByRequest,
        storedHashedToken,
      );

      if (!isValidToken) {
        this.logger.warn(
          'Token mismatch: Provided token does not match stored token.',
        );
        throw new UnauthorizedException('Token mismatch.');
      }

      this.logger.debug('Token validation successful.');
    }

    return user;
  }
}
