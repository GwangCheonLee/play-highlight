import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FindVideosDto } from './dto/find-videos.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { RequestByUser } from '../common/decorator/request-by-user.decorator';
import { GuardTypeEnum } from '../authentication/strategies/guard-type.enum';
import { User } from '../user/entities/user.entity';

@Controller('api/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async findVideos(@Query() findVideosDto: FindVideosDto) {
    const { videos, nextCursor } =
      await this.videoService.findVideos(findVideosDto);

    return {
      data: {
        videos,
        nextCursor,
      },
    };
  }

  @Get('/:uuid')
  async findVideo(@Param('uuid') uuid: string) {
    return {
      data: {
        video: await this.videoService.findVideo(uuid),
      },
    };
  }

  @UseGuards(AuthGuard(GuardTypeEnum.JWT_ACCESS))
  @Post()
  @UseInterceptors(
    FileInterceptor('video', { storage: multer.memoryStorage() }),
  )
  async uploadVideo(
    @RequestByUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      data: { video: await this.videoService.saveVideo(user, file) },
    };
  }
}
