import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
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
import { DataSource, QueryRunner } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RabbitMQProducerService } from '../rabbitmq/producer/rabbit-mq-producer.service';
import { FindVideosDto } from './dto/find-videos.dto';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private readonly privateBucketName: string;
  private readonly rabbitmqQueue: string;

  constructor(
    configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly fileService: FileService,
    private readonly redisService: RedisService,
    private readonly videoRepository: VideoRepository,
    private readonly rabbitMQProducerService: RabbitMQProducerService,
  ) {
    this.privateBucketName = `${configService.get<string>('PROJECT_NAME')}-${AccessTypeEnum.PRIVATE}`;
    this.rabbitmqQueue = configService.get<string>('RABBITMQ_QUEUE');
  }

  findVideos(findVideosDto: FindVideosDto) {
    return this.videoRepository.findVideos(
      findVideosDto.cursor,
      findVideosDto.limit,
    );
  }

  findVideo(uuid: string): Promise<Video> {
    const video: Promise<Video> = this.videoRepository.findOne({
      where: { id: uuid },
      relations: {
        originMetadata: true,
        thumbnailMetadata: true,
        owner: true,
      },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  /**
   * 썸네일 파일에 대한 검증 로직
   *
   * @param {Express.Multer.File} thumbnailFile 썸네일 파일
   * @throws {BadRequestException | PayloadTooLargeException} 유효하지 않은 파일일 경우
   */
  async validateThumbnailFile(
    thumbnailFile: Express.Multer.File,
  ): Promise<void> {
    if (!thumbnailFile) return;

    const fileExtension = path
      .extname(thumbnailFile.originalname)
      .toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        'Thumbnail file must be an image (.jpg, .jpeg, .png)',
      );
    }

    const sizeLimit: number = (await this.redisService.getApplicationSetting(
      ApplicationSettingKeyEnum.UPLOAD_THUMBNAIL_IMAGE_SIZE_LIMIT,
    )) as number;

    if (thumbnailFile.size > sizeLimit) {
      throw new PayloadTooLargeException('Thumbnail image size is too large');
    }
  }

  /**
   * 비디오 파일에 대한 검증 로직
   *
   * @param {Express.Multer.File} videoFile 비디오 파일
   * @throws {BadRequestException} 비디오 파일이 없는 경우
   * @throws {PayloadTooLargeException} 비디오 파일이 너무 큰 경우
   */
  async validateVideoFile(videoFile: Express.Multer.File): Promise<void> {
    if (!videoFile) {
      throw new BadRequestException('Video file is required');
    }

    const videoSizeLimit: number =
      (await this.redisService.getApplicationSetting(
        ApplicationSettingKeyEnum.UPLOAD_VIDEO_SIZE_LIMIT,
      )) as number;

    if (videoFile.size > videoSizeLimit) {
      throw new PayloadTooLargeException('Video file size is too large');
    }
  }

  /**
   * 사용자의 스토리지 용량 제한을 검증합니다.
   *
   * @param {User} user 사용자 정보
   * @param {Express.Multer.File} videoFile 비디오 파일
   * @throws {ForbiddenException} 사용자의 스토리지 크기가 사용량 제한을 초과하면 에러를 던집니다.
   */
  async validateUserStorageLimit(
    user: User,
    videoFile: Express.Multer.File,
  ): Promise<void> {
    const storageLimitInBytes: number =
      (await this.redisService.getApplicationSetting(
        ApplicationSettingKeyEnum.USER_STORAGE_LIMIT,
      )) as number;

    const videoFileSize = videoFile.size;

    const userStorageUsageInBytes: number =
      await this.fileService.getUserStorageSize(user.id);

    if (userStorageUsageInBytes + videoFileSize > storageLimitInBytes) {
      throw new ForbiddenException(
        `User storage limit exceeded. Limit: ${storageLimitInBytes} bytes, Usage: ${userStorageUsageInBytes} bytes, File size: ${videoFileSize} bytes`,
      );
    }
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
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 고유 식별자를 생성
    const videoId = uuidv4();

    let thumbnailFileMetadata: FileMetadata | null = null;
    let videoFileMetadata: FileMetadata | null = null;

    try {
      let thumbnailKey: string | null = null;

      // 섬네일 파일 처리
      if (thumbnailFile) {
        thumbnailFileMetadata =
          await this.fileService.uploadMulterFileToStorage(
            thumbnailFile,
            AccessTypeEnum.PRIVATE,
            user.id,
            `${videoId}/thumbnail`,
          );

        thumbnailKey = thumbnailFileMetadata.key;
      }

      // 동영상 파일 처리
      videoFileMetadata = await this.fileService.uploadMulterFileToStorage(
        videoFile,
        AccessTypeEnum.PRIVATE,
        user.id,
        `${videoId}/video`,
      );

      // 동영상 업로드 상태 설정
      const videoUploadStatus =
        thumbnailKey === null
          ? VideoUploadStatus.ORIGINAL_UPLOADED
          : VideoUploadStatus.THUMBNAIL_GENERATED;

      const videoTitle =
        title !== null && title !== undefined
          ? title
          : `${user.nickname} - ${videoFileMetadata.originalName}`;

      // 데이터베이스에 저장
      const savedVideo: Video = await queryRunner.manager.save(Video, {
        id: videoId,
        videoKey: videoFileMetadata.key,
        thumbnailKey: thumbnailKey,
        originMetadata: videoFileMetadata,
        thumbnailMetadata: thumbnailFileMetadata,
        title: videoTitle,
        videoHlsFileLocation: null,
        owner: user,
        status: videoUploadStatus,
      });

      await queryRunner.commitTransaction();

      this.rabbitMQProducerService.sendMessage(this.rabbitmqQueue, {
        videoId: videoId,
      });

      return savedVideo;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (videoFileMetadata) {
        await queryRunner.manager.remove(videoFileMetadata);
      }

      if (thumbnailFileMetadata) {
        await queryRunner.manager.remove(thumbnailFileMetadata);
      }

      this.logger.warn(`Cleaning up uploaded files for video ID: ${videoId}`);
      await this.fileService.deleteFolder(
        this.privateBucketName,
        `${user.id}/${videoId}`,
      );

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
