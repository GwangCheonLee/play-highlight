import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoRepository } from './repositories/video.repository';

/**
 * 비디오 모듈
 */
@Module({
  providers: [VideoService, VideoRepository],
  exports: [VideoService, VideoRepository],
})
export class VideoModule {}
