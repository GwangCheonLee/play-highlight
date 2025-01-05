import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoRepository } from './repositories/video.repository';
import { FileModule } from '../file/file.module';
import { RedisModule } from '../redis/redis.module';
import { RabbitMQProducerModule } from '../rabbitmq/producer/rabbit-mq-producer.module';

/**
 * 비디오 모듈
 */
@Module({
  imports: [RabbitMQProducerModule, RedisModule, FileModule],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
})
export class VideoModule {}
