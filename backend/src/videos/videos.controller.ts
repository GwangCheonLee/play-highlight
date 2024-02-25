import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VideosService } from './videos.service';
import { FindVideosDto } from './dto/findVideos.dto';
import { AuthGuard } from '@nestjs/passport';
import { GuardTypeEnum } from '../authentication/strategy/guard-type.enum';

@UseGuards(AuthGuard(GuardTypeEnum.JWT_ACCESS))
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
