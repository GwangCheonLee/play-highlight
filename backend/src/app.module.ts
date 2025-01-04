import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './common/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { validationSchemaConfig } from './common/config/validation.config';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { RedisModule } from './redis/redis.module';
import { getEnvPath } from './common/constants/common.constant';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AppInitializationService } from './app-initialization.service';
import { ApplicationSettingModule } from './application-setting/application-setting.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    FileModule,
    UserModule,
    VideoModule,
    RedisModule,
    AuthenticationModule,
    ApplicationSettingModule,
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
  providers: [
    AppService,
    AppInitializationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
