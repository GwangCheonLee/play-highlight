import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER_NAME'),
  password: configService.get('DB_USER_PASSWORD'),
  database: configService.get('DB_NAME'),
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
});
