import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USER_NAME'),
      password: this.configService.get('DB_USER_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      synchronize: false,
      logging: false,
      migrationsRun: true,
      migrations: [__dirname + '/../../migrations/*.js'],
      entities: [__dirname + '/../../**/*.entity.js'],
    };
  }
}
