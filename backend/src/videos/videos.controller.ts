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
import { VideosService } from './videos.service';
import { FindVideosDto } from './dto/findVideos.dto';
import { AuthGuard } from '@nestjs/passport';
import { GuardTypeEnum } from '../authentication/strategy/guard-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { RequestByUser } from '../common/decorator/request-by-user.decorator';
import { User } from '../user/entities/user.entity';

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

  @Get('/:uuid')
  async findVideo(@Param('uuid') uuid: string) {
    return {
      data: {
        video: await this.videosService.findVideo(uuid),
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
      data: { video: await this.videosService.saveVideo(user, file) },
    };
  }
}
