import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getRabbitMQConfig } from './common/config/rabbit-mq.config';
import { getLogLevels } from './common/config/logger.config';

/**
 * 애플리케이션을 부트스트랩하고 서버를 시작합니다.
 * @return {Promise<void>} 비동기 부트스트랩 함수입니다.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV),
  });

  const configService = app.get(ConfigService);
  const rabbitMqConfig = getRabbitMQConfig(configService);

  app.connectMicroservice(rabbitMqConfig);

  await app.startAllMicroservices();
  const serverPort: number = configService.get<number>('SERVER_PORT') || 3000;
  await app.listen(serverPort);
}

bootstrap();
