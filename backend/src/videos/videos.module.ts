import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideosRepository } from './repositories/videos.repository';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';

@Module({
  imports: [FfmpegModule],
  controllers: [VideosController],
  providers: [VideosService, VideosRepository],
})
export class VideosModule {}
