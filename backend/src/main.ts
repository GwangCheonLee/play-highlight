import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { validationPipeConfig } from './common/config/validation.config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(validationPipeConfig());
  app.enableCors();

  app.use(cookieParser());
  await app.listen(+process.env.SERVER_PORT);
}

bootstrap();
