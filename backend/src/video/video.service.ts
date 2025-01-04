import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { VideoRepository } from './repositories/video.repository';
import { User } from '../user/entities/user.entity';
import { Express } from 'express';
import { FileService } from '../file/file.service';
import { AccessTypeEnum } from '../file/enums/access-type.enum';
import { VideoUploadStatus } from './enums/video-upload-status.enum';
import { FileMetadata } from '../file/file-metadata/entities/file-metadata.entity';
import { Video } from './entities/video.entity';
import { ApplicationSettingKeyEnum } from '../application-setting/enums/application-setting-key.enum';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly fileService: FileService,
    private readonly redisService: RedisService,
    private readonly videoRepository: VideoRepository,
  ) {}

  findVideo(uuid: string): Promise<Video> {
    const video: Promise<Video> = this.videoRepository.findOne({
      where: { id: uuid },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  /**
   * 비디오 업로드 처리
   *
   * @param {User} user 사용자 정보
   * @param {string} title 비디오 제목
   * @param {Express.Multer.File} videoFile 비디오 파일
   * @param {Express.Multer.File} thumbnailFile 썸네일 파일
   * @return {Promise<Video>} 업로드된 비디오 정보
   * @throws {ForbiddenException} 사용자의 스토리지 크기가 사용량 제한을 초과하면 에러를 던집니다.
   *
   */
  async uploadVideo(
    user: User,
    title: string | null,
    videoFile: Express.Multer.File,
    thumbnailFile?: Express.Multer.File,
  ): Promise<Video> {
    const storageLimitInBytes: number =
      (await this.redisService.getApplicationSetting(
        ApplicationSettingKeyEnum.USER_STORAGE_LIMIT,
      )) as number;

    const userStorageUsageInBytes: number =
      await this.fileService.getUserStorageSize(user.id);

    if (userStorageUsageInBytes > storageLimitInBytes) {
      throw new ForbiddenException(
        `User storage limit exceeded. Limit: ${storageLimitInBytes} bytes, Usage: ${userStorageUsageInBytes} bytes`,
      );
    }

    // 고유 식별자를 생성
    const videoId = uuidv4();

    let thumbnailKey: string | null = null;
    let thumbnailMetadata: FileMetadata | null = null;

    // 섬네일 파일 처리
    if (thumbnailFile) {
      const fileExtension = path
        .extname(thumbnailFile.originalname)
        .toLowerCase();
      const allowedExtensions = ['.jpg', '.jpeg', '.png'];

      if (!allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException(
          'Thumbnail file must be an image (.jpg, .jpeg, .png)',
        );
      }

      const savedThumbnailMetadata =
        await this.fileService.uploadMulterFileToStorage(
          thumbnailFile,
          AccessTypeEnum.PRIVATE,
          user.id,
          `${videoId}/thumbnail`,
        );

      thumbnailKey = savedThumbnailMetadata.key;
      thumbnailMetadata = savedThumbnailMetadata;
    }

    // 동영상 파일 처리
    const videoMetadata = await this.fileService.uploadMulterFileToStorage(
      videoFile,
      AccessTypeEnum.PRIVATE,
      user.id,
      `${videoId}/video`,
    );

    // 동영상 업로드 상태 설정
    const uploadStatus =
      thumbnailKey === null
        ? VideoUploadStatus.ORIGINAL_UPLOADED
        : VideoUploadStatus.THUMBNAIL_GENERATED;

    if (title === null || title === undefined) {
      title = `${user.nickname} - ${videoMetadata.originalName}`;
    }

    // 데이터베이스에 저장
    return await this.videoRepository.save({
      id: videoId,
      videoKey: videoMetadata.key,
      thumbnailKey: thumbnailKey,
      originMetadata: videoMetadata,
      thumbnailMetadata: thumbnailMetadata,
      title: title,
      videoHlsFileLocation: null,
      owner: user,
      status: uploadStatus,
    });
  }
}
