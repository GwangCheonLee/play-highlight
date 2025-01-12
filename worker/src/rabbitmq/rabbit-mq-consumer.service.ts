import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { VideoEncodingMessageInterface } from './interfaces/video-encoding-payload.interface';
import { VideoService } from '../video/video.service';
import { Video } from '../video/entities/video.entity';
import { S3Service } from '../s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { AccessTypeEnum } from '../s3/enums/access-type.enum';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';
import { DataSource, QueryRunner } from 'typeorm';
import { VideoUploadStatus } from '../video/enums/video-upload-status.enum';
import { FileMetadata } from '../file-metadata/entities/file-metadata.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class RabbitMqConsumerService {
  private readonly logger = new Logger(RabbitMqConsumerService.name);

  private readonly privateBucketName: string;

  constructor(
    configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,
    private readonly videoService: VideoService,
    private readonly ffmpegService: FfmpegService,
  ) {
    this.privateBucketName = `${configService.get<string>('PROJECT_NAME')}-${AccessTypeEnum.PRIVATE}`;
  }

  /**
   * 비디오 인코딩 메시지를 처리합니다.
   *
   * @param {VideoEncodingMessageInterface} message - 비디오 인코딩 메시지
   * @throws {InternalServerErrorException} 비디오 파일이 존재하지 않을 경우
   */
  async handleVideoEncoding(message: VideoEncodingMessageInterface) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const video: Video = await this.videoService.findVideoById(message.videoId);

    const originalVideoKey = `${video.owner.id}/${message.videoId}/video.${video.originMetadata.extension}`;
    const isFileExist = await this.s3Service.isFileExists(
      this.privateBucketName,
      originalVideoKey,
    );

    if (!isFileExist) {
      this.logger.error(`Video file not found: ${originalVideoKey}`);
      throw new InternalServerErrorException('Video file not found');
    }

    const videoTmpFolderPath = path.resolve(
      __dirname,
      '../../tmp',
      message.videoId,
    );

    try {
      await queryRunner.startTransaction();
      const originalVideoBuffer: Buffer = await this.s3Service.download(
        this.privateBucketName,
        originalVideoKey,
      );

      if (video.status === VideoUploadStatus.ORIGINAL_UPLOADED) {
        await this.processingThumbnail(queryRunner, video, originalVideoBuffer);
      }

      await this.processingHlsEncoding(originalVideoBuffer, video);

      await queryRunner.manager.update(Video, video.id, {
        status: VideoUploadStatus.HLS_ENCODING_COMPLETED,
        videoHlsFileLocation: `${this.privateBucketName}/${video.owner.id}/${message.videoId}/master.m3u8`,
      });

      await queryRunner.commitTransaction();

      this.logger.log(
        `Handling highlight video encoding: ${JSON.stringify(message)}`,
      );
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();

      // 임시 폴더 삭제
      try {
        if (fs.existsSync(videoTmpFolderPath)) {
          fs.rmSync(videoTmpFolderPath, { recursive: true, force: true });
          this.logger.log(`Temporary folder deleted: ${videoTmpFolderPath}`);
        }
      } catch (err) {
        this.logger.error(
          `Failed to clean up temporary folder: ${videoTmpFolderPath}`,
          err.stack,
        );
      }
    }
  }

  /**
   * 썸네일을 생성하고 S3에 업로드한 후, 관련 메타데이터를 데이터베이스에 저장합니다.
   *
   * @param {QueryRunner} queryRunner - 트랜잭션 처리를 위한 QueryRunner
   * @param {Video} video - 비디오 엔티티
   * @param {Buffer} videoBuffer - 비디오 파일 버퍼
   * @throws {Error} 썸네일 생성 또는 업로드 실패 시
   */
  async processingThumbnail(
    queryRunner: QueryRunner,
    video: Video,
    videoBuffer: Buffer,
  ) {
    const thumbnailKey = `${video.owner.id}/${video.id}/thumbnail.jpg`;
    try {
      const thumbnailBuffer = await this.ffmpegService.generateThumbnail(
        videoBuffer,
        video.originMetadata.extension,
        video.id,
      );

      const uploadResult = await this.s3Service.upload(
        this.privateBucketName,
        thumbnailKey,
        thumbnailBuffer,
        'image/jpeg',
      );

      const generatedUuid: string = uuidv4();

      const uploadedFileMetadata: FileMetadata = queryRunner.manager.create(
        FileMetadata,
        {
          bucketName: this.privateBucketName,
          key: generatedUuid,
          originalName: 'thumbnail.jpg',
          extension: 'jpg',
          mimeType: 'image/jpeg',
          ownerId: video.owner.id,
          checksum: uploadResult.etag,
          size: thumbnailBuffer.length,
          storageLocation: uploadResult.location,
          isPublic: false,
          owner: { id: video.owner.id },
        },
      );

      await queryRunner.manager.save(uploadedFileMetadata);

      await queryRunner.manager.update(Video, video.id, {
        status: VideoUploadStatus.THUMBNAIL_GENERATED,
        thumbnailMetadata: uploadedFileMetadata,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      const fileExists: boolean = await this.s3Service.isFileExists(
        this.privateBucketName,
        thumbnailKey,
      );

      if (fileExists) {
        this.logger.warn(
          `Rolling back transaction. Deleting partial file: ${thumbnailKey}`,
        );

        try {
          await this.s3Service.deleteFile(this.privateBucketName, thumbnailKey);
        } catch (deleteError) {
          this.logger.error(
            `Failed to delete partial file: ${thumbnailKey}`,
            deleteError,
          );
        }
      }

      throw error;
    }
  }

  /**
   * HLS 인코딩을 처리합니다.
   *
   * @param {Buffer} videoBuffer - 비디오 파일 버퍼
   * @param {Video} video - 비디오 엔티티
   * @throws {Error} HLS 인코딩 중 문제가 발생한 경우
   */
  async processingHlsEncoding(videoBuffer: Buffer, video: Video) {
    const encodingResult = await this.ffmpegService.encodeToHlsByBuffer(
      videoBuffer,
      video.originMetadata.extension,
      video.id,
    );

    const { encodedResolutions, videoFolderPath } = encodingResult;
    const videoKey = path.basename(videoFolderPath);
    const allFilePaths: {
      absolutePath: string;
      relativePath: string;
      buffer: Buffer;
      mimeType: string;
    }[] = [];

    try {
      // 각 해상도 폴더의 파일들과 master.m3u8 파일을 처리
      await Promise.all(
        encodedResolutions.flatMap((resolution) => {
          const resolutionFolderPath = path.join(videoFolderPath, resolution);
          if (fs.existsSync(resolutionFolderPath)) {
            const files = fs.readdirSync(resolutionFolderPath);
            return files.map((file) => {
              const absolutePath = path.join(resolutionFolderPath, file);
              const relativePath = path.join(videoKey, resolution, file);
              const buffer = fs.readFileSync(absolutePath);
              const extension = path.extname(file).toLowerCase();
              const mimeType =
                extension === '.m3u8'
                  ? 'application/vnd.apple.mpegurl'
                  : extension === '.ts'
                    ? 'video/mp2t'
                    : 'application/octet-stream';

              allFilePaths.push({
                absolutePath,
                relativePath,
                buffer,
                mimeType,
              });

              return this.s3Service.upload(
                this.privateBucketName,
                `${video.owner.id}/${relativePath}`,
                buffer,
                mimeType,
              );
            });
          }
          return [];
        }),
      );

      // master.m3u8 파일 처리
      const masterFilePath = path.join(videoFolderPath, 'master.m3u8');
      if (fs.existsSync(masterFilePath)) {
        const buffer = fs.readFileSync(masterFilePath);
        const relativePath = path.join(videoKey, 'master.m3u8');
        const mimeType = 'application/vnd.apple.mpegurl';

        allFilePaths.push({
          absolutePath: masterFilePath,
          relativePath,
          buffer,
          mimeType,
        });

        // master.m3u8 파일 업로드
        await this.s3Service.upload(
          this.privateBucketName,
          `${video.owner.id}/${relativePath}`,
          buffer,
          mimeType,
        );
      }

      this.logger.log('All files uploaded successfully.');
      return allFilePaths;
    } catch (error) {
      this.logger.error('Error while processing file paths:', error.message);
      throw error;
    }
  }
}
