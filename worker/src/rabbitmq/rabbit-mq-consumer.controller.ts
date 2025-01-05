import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { VideoEncodingPayloadInterface } from './interfaces/video-encoding-payload.interface';
import { RabbitMqConsumerService } from './rabbit-mq-consumer.service';

/**
 * RabbitMQ 컨슈머 컨트롤러
 *
 * RabbitMQ 메시지를 수신하고 처리하는 컨트롤러입니다.
 */
@Controller()
export class RabbitMQConsumerController {
  private readonly logger = new Logger(RabbitMQConsumerController.name);

  constructor(
    private readonly rabbitMQConsumerService: RabbitMqConsumerService,
  ) {}

  /**
   * Rabbit MQ 큐에서 메시지를 처리합니다.
   *
   * @param {VideoEncodingPayloadInterface} payload - 메시지 데이터 (객체 형태)
   * @param {RmqContext} context - 메시지 컨텍스트
   */
  @MessagePattern('play-highlight-video-encoding-queue')
  async handleMessage(
    @Payload() payload: VideoEncodingPayloadInterface,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload.pattern !== 'string' ||
      !payload.data
    ) {
      this.logger.error('Invalid message format received:', payload);
      channel.nack(originalMsg, false, false);
      return;
    }

    this.logger.log(
      `Received message with pattern: ${payload.pattern}, data: ${JSON.stringify(payload.data)}`,
    );

    try {
      await this.rabbitMQConsumerService.handleVideoEncoding(payload.data);

      this.logger.log(`Successfully processed pattern: ${payload.pattern}`);

      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Error processing message for pattern: ${payload.pattern}, Error: ${error.message}`,
        error.stack,
      );
      channel.nack(originalMsg, false, false);
    }
  }
}
