import { Controller, Get, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { FindVideosDto } from './dto/findVideos.dto';

@Controller('api/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async findVideos(@Query() findVideosDto: FindVideosDto) {
    const { videos, nextCursor } =
      await this.videosService.findVideos(findVideosDto);

    return {
      data: {
        videos,
        nextCursor,
      },
    };
  }
}
