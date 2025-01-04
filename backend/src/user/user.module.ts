import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { FileModule } from '../file/file.module';
import { RedisModule } from '../redis/redis.module';

/**
 * 사용자 모듈로, 사용자 관련 컨트롤러와 서비스를 관리합니다.
 * @module UserModule
 */
@Module({
  imports: [RedisModule, FileModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
