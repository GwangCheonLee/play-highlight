import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from './s3/s3.service';
import { v4 as uuidv4 } from 'uuid';
import { DataSource, QueryRunner } from 'typeorm';
import { S3UploadResult } from './s3/types/s3-upload-result.type';
import { FileMetadata } from './file-metadata/entities/file-metadata.entity';
import { BufferUploadMetadata } from './types/buffer-upload-metadata.type';
import { ConfigService } from '@nestjs/config';
import { FileMetadataService } from './file-metadata/file-metadata.service';
import { Express } from 'express';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly bucketName: string;

  constructor(
    configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
    private readonly fileMetadataService: FileMetadataService,
  ) {
    this.bucketName = configService.get<string>('PROJECT_NAME');
  }

  /**
   * 파일이 존재하는지 확인합니다.
   *
   * @param {string} fileKey - 파일 식별자
   * @param {string} ownerId - 파일 소유자 식별자
   * @return {Promise<FileMetadata>} 파일 메타데이터
   *
   */
  async isFileExists(fileKey: string, ownerId: string): Promise<boolean> {
    const s3Exists = await this.s3Service.isFileExists(
      this.bucketName,
      fileKey,
    );

    const fileMetadata: FileMetadata =
      await this.fileMetadataService.getOneFileMetadata(
        this.bucketName,
        `${this.bucketName}/${fileKey}`,
        ownerId,
      );

    if (s3Exists === true && fileMetadata === null) {
      await this.s3Service.deleteFile(this.bucketName, fileKey);
    }

    if (s3Exists === false && fileMetadata) {
      await this.fileMetadataService.deleteFileMetadata(fileMetadata.key);
    }

    return fileMetadata && s3Exists;
  }

  /**
   * Buffer를 파일로 저장하고, 파일 메타데이터를 데이터베이스에 저장합니다.
   *
   * @param {BufferUploadMetadata} bufferMetadata - Buffer 업로드 메타데이터
   * @return {Promise<void>}
   */
  async uploadBufferToStorage(
    bufferMetadata: BufferUploadMetadata,
  ): Promise<void> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 파일 식별을 위한 UUID 생성
    const generatedUuid: string = uuidv4();
    const fileKey = `${bufferMetadata.ownerId}/${generatedUuid}.${bufferMetadata.extension}`;

    try {
      // S3에 업로드
      const uploadResult: S3UploadResult = await this.s3Service.upload(
        this.bucketName,
        fileKey,
        bufferMetadata.buffer,
        bufferMetadata.contentType,
      );

      // 메타데이터 생성
      const uploadedFileMetadata: FileMetadata = queryRunner.manager.create(
        FileMetadata,
        {
          bucketName: this.bucketName,
          key: generatedUuid,
          originalName: bufferMetadata.originalName,
          extension: bufferMetadata.extension,
          mimeType: bufferMetadata.mimeType,
          ownerId: bufferMetadata.ownerId,
          checksum: uploadResult.etag,
          size: bufferMetadata.buffer.length,
          storageLocation: uploadResult.location,
          owner: { id: bufferMetadata.ownerId },
        },
      );

      // 메타데이터 저장
      await queryRunner.manager.save(uploadedFileMetadata);

      await queryRunner.commitTransaction();
      this.logger.debug('Uploaded file and saved metadata successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.handleFileUploadError(error, this.bucketName, fileKey);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Multer File을 저장하고, 파일 메타데이터를 데이터베이스에 저장합니다.
   *
   * @param {Express.Multer.File} file - Multer File
   * @param {string} ownerId - 파일 소유자 식별자
   * @param {string | null} customFileName - 사용자 정의 파일 이름
   * @return {Promise<FileMetadata>} 파일 메타데이터
   */
  async uploadMulterFileToStorage(
    file: Express.Multer.File,
    ownerId: string,
    customFileName: string | null = null,
  ): Promise<FileMetadata> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 파일 식별을 위한 UUID 생성
    const generatedUuid: string = uuidv4();

    const extension = file.originalname.split('.').pop();

    let fileKey = `${ownerId}/${generatedUuid}.${extension}`;

    if (customFileName) {
      fileKey = `${ownerId}/${customFileName}.${extension}`;
    }

    try {
      // S3에 업로드
      const uploadResult: S3UploadResult = await this.s3Service.upload(
        this.bucketName,
        fileKey,
        file.buffer,
        file.mimetype,
      );

      // 메타데이터 생성
      const uploadedFileMetadata: FileMetadata = queryRunner.manager.create(
        FileMetadata,
        {
          bucketName: this.bucketName,
          key: generatedUuid,
          originalName: file.originalname,
          extension,
          mimeType: file.mimetype,
          ownerId,
          checksum: uploadResult.etag,
          size: file.size,
          storageLocation: uploadResult.location,
          owner: { id: ownerId },
        },
      );

      // 메타데이터 저장
      await queryRunner.manager.save(uploadedFileMetadata);

      await queryRunner.commitTransaction();

      this.logger.debug('Uploaded file and saved metadata successfully');
      return uploadedFileMetadata;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.handleFileUploadError(error, this.bucketName, fileKey);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 특정 유저가 사용하고 있는 스토리지 크기를 계산합니다.
   *
   * @param {string} userId 유저의 ID (폴더 경로)
   * @param {string[]} ignoredExtensions 무시할 확장자 리스트
   * @return {Promise<number>} 유저가 사용 중인 총 스토리지 크기 (바이트 단위)
   */
  async getUserStorageSize(
    userId: string,
    ignoredExtensions: string[] = [],
  ): Promise<number> {
    return this.s3Service.getUserStorageSize(userId, ignoredExtensions);
  }

  /**
   * S3에서 특정 키를 가진 폴더를 삭제합니다.
   *
   * @param {string} bucketName 삭제할 폴더가 있는 버킷 이름
   * @param {string} folderKey 삭제할 폴더의 키 (접두사)
   * @return {Promise<void>}
   * @throws {Error} 삭제 중 오류가 발생하면 에러를 던집니다.
   */
  deleteFolder(bucketName: string, folderKey: string): Promise<void> {
    return this.s3Service.deleteFolder(bucketName, folderKey);
  }

  /**
   * 파일 업로드 중 에러가 발생했을 때 처리합니다.
   *
   * @param {any} error - 에러 객체
   * @param {string} bucketName - S3 버킷 이름
   * @param {string} fileKey - 파일 식별자
   * @return {Promise<void>}
   */
  public async handleFileUploadError(
    error: any,
    bucketName: string,
    fileKey: string,
  ): Promise<void> {
    // 이미 S3에 업로드된 파일이 있을 경우 삭제
    const fileExists: boolean = await this.s3Service.isFileExists(
      bucketName,
      fileKey,
    );

    if (fileExists) {
      this.logger.warn(
        `Rolling back transaction. Deleting partial file: ${fileKey}`,
      );

      try {
        await this.s3Service.deleteFile(bucketName, fileKey);
      } catch (deleteError) {
        this.logger.error(
          `Failed to delete partial file: ${fileKey}`,
          deleteError,
        );
      }
    }

    this.logger.error('Failed to upload file and save metadata', error);
    throw error;
  }
}
