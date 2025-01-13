import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { ApplicationSettingRepository } from './application-setting/repositories/application-setting.repository';
import { ApplicationSetting } from './application-setting/entities/application-setting.entity';
import { S3Service } from './file/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';

@Injectable()
export class AppInitializationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppInitializationService.name);

  constructor(
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly applicationSettingRepository: ApplicationSettingRepository,
  ) {}

  /**
   * 애플리케이션 초기화 시 실행되는 함수입니다.
   * 애플리케이션 설정을 로드하고 Redis에 기본 설정을 저장합니다.
   */
  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Starting application initialization...');
    try {
      // 기본 애플리케이션 설정을 Redis에 저장
      await this.initializeDefaultApplicationSettings();
      this.logger.debug('Application settings initialized successfully.');

      // S3 버킷 초기화
      await this.initializeS3Bucket();
      this.logger.debug('Application initialization complete.');

      // Root 사용자 초기화
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

    const bucketName = `${defaultBucketName}`;

    const exists = await this.s3Service.isBucketExists(bucketName);

    if (!exists) {
      this.logger.debug(`Bucket ${bucketName} does not exist. Creating...`);

      await this.s3Service.createPublicBucket(bucketName);

      this.logger.debug(`Bucket ${bucketName} created successfully.`);
    } else {
      this.logger.debug(`Bucket ${bucketName} already exists.`);
    }
  }
}
