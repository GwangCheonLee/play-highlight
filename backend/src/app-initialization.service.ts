import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { ApplicationSettingRepository } from './application-setting/repositories/application-setting.repository';
import { ApplicationSetting } from './application-setting/entities/application-setting.entity';
import { S3Service } from './file/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { AccessTypeEnum } from './file/enums/access-type.enum';
import { join } from 'path';
import { readFileSync } from 'node:fs';
import { FileService } from './file/file.service';
import { BufferUploadMetadata } from './file/types/buffer-upload-metadata.type';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';

@Injectable()
export class AppInitializationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppInitializationService.name);

  private readonly publicBucketName: string;

  constructor(
    private readonly s3Service: S3Service,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly applicationSettingRepository: ApplicationSettingRepository,
  ) {
    this.publicBucketName = `${configService.get<string>('PROJECT_NAME')}-${AccessTypeEnum.PUBLIC}`;
  }

  /**
   * 애플리케이션 초기화 시 실행되는 함수입니다.
   * 애플리케이션 설정을 로드하고 Redis에 기본 설정을 저장합니다.
   */
  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Starting application initialization...');
    try {
      await this.initializeDefaultApplicationSettings();
      this.logger.debug('Application settings initialized successfully.');
      await this.initializeS3Bucket();
      this.logger.debug('Application initialization complete.');
      await this.uploadDefaultAssets();
      this.logger.debug('Default assets uploaded successfully.');
      await this.userService.ensureRootUsersExist();
      this.logger.debug('Root users initialized successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to initialize application settings',
        error.stack,
      );
    }
  }

  /**
   * 기본 애플리케이션 설정을 Redis에 저장하는 함수입니다.
   * 데이터베이스에서 설정값을 가져와 Redis에 병렬로 저장합니다.
   *
   * @return {Promise<void>}
   */
  async initializeDefaultApplicationSettings(): Promise<void> {
    this.logger.debug('Fetching application settings from database...');
    const applicationSettings: ApplicationSetting[] =
      await this.applicationSettingRepository.find();

    if (applicationSettings.length === 0) {
      this.logger.warn('No application settings found in the database.');
      return;
    }

    this.logger.debug(
      `Found ${applicationSettings.length} application settings. Saving to Redis...`,
    );

    const redisPromises: Promise<void>[] = applicationSettings.map((setting) =>
      this.redisService.setApplicationSetting(
        setting.settingKey,
        setting.settingValue,
      ),
    );

    await Promise.all(redisPromises);

    this.logger.debug(
      `Successfully saved ${applicationSettings.length} application settings to Redis.`,
    );
  }

  /**
   * S3 Bucket이 존재하는지 확인하고 없으면 생성하는 함수입니다.
   *
   * @return {Promise<void>}
   * @throws {Error} Bucket 생성 중 에러 발생 시
   *
   */
  async initializeS3Bucket(): Promise<void> {
    const defaultBucketName = this.configService.get<string>('PROJECT_NAME');

    for (const accessType of Object.values(AccessTypeEnum)) {
      const bucketName = `${defaultBucketName}-${accessType}`;

      const exists = await this.s3Service.isBucketExists(bucketName);

      if (!exists) {
        this.logger.debug(`Bucket ${bucketName} does not exist. Creating...`);

        if (accessType === AccessTypeEnum.PUBLIC) {
          await this.s3Service.createPublicBucket(bucketName);
        } else if (accessType === AccessTypeEnum.PRIVATE) {
          await this.s3Service.createPrivateBucket(bucketName);
        }

        this.logger.debug(`Bucket ${bucketName} created successfully.`);
      } else {
        this.logger.debug(`Bucket ${bucketName} already exists.`);
      }
    }
  }

  /**
   * 기본 Assets을 S3 버킷에 업로드하는 함수입니다.
   *
   * @return {Promise<void>}
   */
  async uploadDefaultAssets(): Promise<void> {
    const assetUser: User = await this.userService.getOrCreateAssetUser();

    const fileExists = await this.fileService.isFileExists(
      AccessTypeEnum.PUBLIC,
      'default_profile.png',
      assetUser.id,
    );

    if (fileExists) {
      return;
    }

    const defaultProfileImagePath: string = join(
      process.cwd(),
      'assets',
      'default_profile.png',
    );
    const defaultProfileImageBuffer: Buffer = readFileSync(
      defaultProfileImagePath,
    );

    const bufferUploadMetadata: BufferUploadMetadata = {
      buffer: defaultProfileImageBuffer,
      accessType: AccessTypeEnum.PUBLIC,
      contentType: 'image/png',
      originalName: 'default_profile.png',
      extension: 'png',
      mimeType: 'image/png',
      ownerId: assetUser.id,
    };

    await this.fileService.uploadBufferToStorage(bufferUploadMetadata);
  }
}
