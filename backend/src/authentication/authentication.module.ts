import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [JwtModule],
  controllers: [AuthenticationController],
  providers: [
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    UserRepository,
    AuthenticationService,
  ],
  exports: [
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    UserRepository,
    AuthenticationService,
  ],
})
export class AuthenticationModule {}
