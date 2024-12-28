import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserRepository } from '../user/repositories/user.repository';
import { GoogleStrategy } from './strategies/google.strategy';

/**
 * Authentication 모듈은 사용자 인증과 관련된 모든 기능을 담당하는 모듈입니다.
 * 이 모듈은 로그인, 회원가입, 액세스 토큰 및 리프레시 토큰 발급을 포함한
 * 인증 로직을 처리합니다.
 */
@Module({
  imports: [JwtModule],
  controllers: [AuthenticationController],
  providers: [
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    AuthenticationService,
    UserRepository,
  ],
})
export class AuthenticationModule {}
