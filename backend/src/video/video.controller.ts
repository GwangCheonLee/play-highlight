import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FindVideosDto } from './dto/find-videos.dto';
import { User } from '../user/entities/user.entity';
import { Express } from 'express';
import { JwtAccessGuard } from '../authentication/guards/jwt-access.guard';
import { UploadVideoRequestBodyDto } from './dto/upload-video-request-body.dto';
import * as multer from 'multer';
import { GetUser } from '../user/decorators/get-user';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Video } from './entities/video.entity';

/**
 * 비디오 컨트롤러
 */
@UseGuards(JwtAccessGuard)
@Controller({ version: '1', path: 'videos' })
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async findVideos(@Query() findVideosDto: FindVideosDto) {
    const { videos, nextCursor } =
      await this.videoService.findVideos(findVideosDto);

    return {
      videos,
      nextCursor,
    };
  }

  /**
   * 비디오 단일 조회 API
   *
   * @param {string} uuid 비디오 고유 식별자
   * @return {Promise<Video>} 비디오 정보
   */
  @Get('/:uuid')
  findVideo(@Param('uuid') uuid: string): Promise<Video> {
    return this.videoService.findVideo(uuid);
  }

  /**
   * 비디오 업로드 API
   *
   * @param {User} user 사용자 정보
   * @param {Express.Multer.File[]} files 업로드된 파일 목록
   * @param {UploadVideoRequestBodyDto} uploadVideoRequestBodyDto 업로드할 비디오 정보
   * @return {Promise<Video>} 업로드된 비디오 정보
   * @throws {BadRequestException} 비디오 파일이 필요한 경우
   */
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 }, // 동영상 파일
        { name: 'thumbnail', maxCount: 1 }, // 섬네일 파일
      ],
      { storage: multer.memoryStorage() }, // 메모리 스토리지 사용
    ),
  )
  async uploadVideo(
    @GetUser() user: User,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() uploadVideoRequestBodyDto: UploadVideoRequestBodyDto,
  ): Promise<Video> {
    // 섬네일 파일에 대한 검증 로직
    const thumbnailFile = files.thumbnail?.[0];
    await this.videoService.validateThumbnailFile(thumbnailFile);

    // 비디오 파일에 대한 검증 로직
    const videoFile = files.video?.[0];
    await this.videoService.validateVideoFile(videoFile);

    // 사용자의 저장 용량 제한 검증 로직
    await this.videoService.validateUserStorageLimit(user, videoFile);

    return await this.videoService.uploadVideo(
      user,
      uploadVideoRequestBodyDto.title,
      videoFile,
      thumbnailFile,
    );
  }
}
