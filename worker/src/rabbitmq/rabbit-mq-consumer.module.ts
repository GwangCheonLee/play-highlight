import { Module } from "@nestjs/common";
import { RabbitMQConsumerController } from "./rabbit-mq-consumer.controller";
import { RabbitMqConsumerService } from "./rabbit-mq-consumer.service";
import { VideoModule } from "../video/video.module";
import { S3Module } from "../s3/s3.module";
import { FfmpegModule } from "../ffmpeg/ffmpeg.module";

/**
 * RabbitMQ 컨슈머 모듈
 *
 * RabbitMQ 컨슈머의 컨트롤러와 서비스를 제공하는 모듈입니다.
 */
@Module({
  imports: [VideoModule, FfmpegModule, S3Module],
  controllers: [RabbitMQConsumerController],
  providers: [RabbitMqConsumerService],
})
export class RabbitMQConsumerModule {}
