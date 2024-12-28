import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './common/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/constant/common.constant';
import { validationSchemaConfig } from './common/config/validation.config';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    UserModule,
    VideoModule,
    RedisModule,
    AuthenticationModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(),
      validationSchema: validationSchemaConfig(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
