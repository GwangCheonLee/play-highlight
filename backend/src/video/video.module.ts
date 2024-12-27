import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { VideoRepository } from './repositories/video.repository';

@Module({
  imports: [FfmpegModule],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
})
export class VideoModule {}
