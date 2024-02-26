import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { FindVideosDto } from './dto/findVideos.dto';
import { AuthGuard } from '@nestjs/passport';
import { GuardTypeEnum } from '../authentication/strategy/guard-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { RequestByUser } from '../common/decorator/request-by-user.decorator';
import { Users } from '../authentication/entities/users.entity';

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

  @Post()
  @UseInterceptors(
    FileInterceptor('video', { storage: multer.memoryStorage() }),
  )
  async uploadVideo(
    @RequestByUser() user: Users,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      data: { video: await this.videosService.saveVideo(user, file) },
    };
  }
}
