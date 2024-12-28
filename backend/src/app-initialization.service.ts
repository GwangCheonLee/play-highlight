import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { ApplicationSettingRepository } from './application-setting/repositories/application-setting.repository';
import { ApplicationSetting } from './application-setting/entities/application-setting.entity';

@Injectable()
export class AppInitializationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppInitializationService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly applicationSettingRepository: ApplicationSettingRepository,
  ) {}

  /**
   * 애플리케이션 초기화 시 실행되는 함수입니다.
   * 애플리케이션 설정을 로드하고 Redis에 기본 설정을 저장합니다.
   */
  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Starting application initialization...');
    try {
      await this.initializeDefaultApplicationSettings();
      this.logger.log('Application settings initialized successfully.');
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
   */
  async initializeDefaultApplicationSettings(): Promise<void> {
    this.logger.log('Fetching application settings from database...');
    const applicationSettings: ApplicationSetting[] =
      await this.applicationSettingRepository.find();

    if (applicationSettings.length === 0) {
      this.logger.warn('No application settings found in the database.');
      return;
    }

    this.logger.log(
      `Found ${applicationSettings.length} application settings. Saving to Redis...`,
    );

    // 병렬로 Redis에 설정값 저장
    const redisPromises: Promise<void>[] = applicationSettings.map((setting) =>
      this.redisService.setApplicationSetting(
        setting.settingKey,
        setting.settingValue,
      ),
    );

    await Promise.all(redisPromises);

    this.logger.log(
      `Successfully saved ${applicationSettings.length} application settings to Redis.`,
    );
  }
}
