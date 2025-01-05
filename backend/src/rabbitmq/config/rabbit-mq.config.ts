import { ClientProvider, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

/**
 * RabbitMQ 프로듀서 설정을 반환합니다.
 *
 * @param {ConfigService} configService - ConfigService 인스턴스
 * @return {ClientProvider} RabbitMQ 클라이언트 설정
 */
export function getRabbitMQProducerConfig(
  configService: ConfigService,
): ClientProvider {
  const rabbitMQUrls = configService.get<string>('RABBITMQ_URLS');
  const rabbitMQQueue = configService.get<string>('RABBITMQ_QUEUE');
  const rabbitMQDurable = configService.get<boolean>('RABBITMQ_QUEUE_DURABLE');

  return {
    transport: Transport.RMQ,
    options: {
      urls: rabbitMQUrls.split(','),
      queue: rabbitMQQueue,
      queueOptions: {
        durable: rabbitMQDurable,
      },
    },
  };
}
