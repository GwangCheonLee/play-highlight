import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [JwtModule],
  controllers: [AuthenticationController],
  providers: [
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    UsersRepository,
    AuthenticationService,
  ],
})
export class AuthenticationModule {}
