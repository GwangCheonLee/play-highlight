import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisRepository } from './redis.repository';
import {
  applicationSettingKey,
  userAccessTokenKey,
  userRefreshTokenKey,
} from './constants/redis-key.constant';
import { hashWithSHA256 } from '../common/constants/encryption.constant';
import { ApplicationSettingKeyEnum } from '../application-setting/enums/application-setting-key.enum';
import { ApplicationSettingRepository } from '../application-setting/repositories/application-setting.repository';
import { ApplicationSetting } from '../application-setting/entities/application-setting.entity';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly redisRepository: RedisRepository,
    private readonly applicationSettingRepository: ApplicationSettingRepository,
  ) {}

  /**
   * 유저의 accessToken을 Redis에서 가져옵니다.
   * @param {string} userId - 토큰을 가져올 유저의 아이디
   * @return {Promise<string>} - 유저의 hashed accessToken
   */
  getUserHashedAccessToken(userId: string): Promise<string | null> {
    return this.redisRepository.get(userAccessTokenKey(userId));
  }

  /**
   * 유저의 refreshToken을 Redis에서 가져옵니다.
   * @param {string} userId - 토큰을 가져올 유저의 아이디
   * @return {Promise<string>} - 유저의 hashed refreshToken
   */
  getUserHashedRefreshToken(userId: string): Promise<string | null> {
    return this.redisRepository.get(userRefreshTokenKey(userId));
  }

  /**
   * 유저의 accessToken을  Redis에 저장합니다.
   *
   * @param {string} userId - 토큰을 저장할 유저의 아이디
   * @param {string} accessToken - 토큰
   * @return {Promise<void>} - 데이터 저장이 완료되면 반환되는 Promise
   */
  async setUserAccessToken(userId: string, accessToken: string): Promise<void> {
    const accessTokenExpirationTime: number = this.configService.get<number>(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );

    const hashedAccessToken = hashWithSHA256(accessToken);
    await this.redisRepository.set(
      userAccessTokenKey(userId),
      hashedAccessToken,
      accessTokenExpirationTime,
    );
  }

  /**
   * 유저의 refreshToken을  Redis에 저장합니다.
   *
   * @param {string} userId - 토큰을 저장할 유저의 아이디
   * @param {string} refreshToken - 토큰
   * @return {Promise<void>} - 데이터 저장이 완료되면 반환되는 Promise
   */
  async setUserRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenExpirationTime: number = this.configService.get<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );

    const hashedAccessToken = hashWithSHA256(refreshToken);
    await this.redisRepository.set(
      userRefreshTokenKey(userId),
      hashedAccessToken,
      refreshTokenExpirationTime,
    );
  }

  /**
   * Redis에서 Application Setting을 조회하고,
   * 없으면 데이터베이스에서 조회 후 Redis에 캐싱합니다.
   *
   * @param {ApplicationSettingKeyEnum} settingKey - 설정의 키
   * @return {Promise<any>} - 조회된 설정 값
   */
  async getApplicationSetting(
    settingKey: ApplicationSettingKeyEnum,
  ): Promise<any> {
    // Redis에서 설정 조회
    const applicationSetting: any = await this.redisRepository.get(
      applicationSettingKey(settingKey),
    );

    if (applicationSetting) {
      return applicationSetting;
    }

    // 데이터베이스에서 설정 조회
    const setting: ApplicationSetting =
      await this.applicationSettingRepository.findOneByKey(settingKey);

    if (!setting) {
      this.logger.error(
        `Application setting for key: ${settingKey} not found in database.`,
      );
      throw new NotFoundException(
        `Application setting for key: ${settingKey} does not exist.`,
      );
    }

    // Redis에 저장
    await this.setApplicationSetting(settingKey, setting.settingValue);

    return setting.settingValue;
  }

  /**
   * Redis에 Application Setting을 설정하고 캐싱합니다.
   *
   * @param {ApplicationSettingKeyEnum} settingKey - 설정의 키
   * @param {string} settingValue - 설정의 값
   * @return {Promise<void>} - 데이터 저장이 완료되면 반환되는 Promise
   */
  async setApplicationSetting(
    settingKey: ApplicationSettingKeyEnum,
    settingValue: string,
  ): Promise<void> {
    this.logger.debug(
      `Saving application setting for key: ${settingKey} to Redis...`,
    );

    await this.redisRepository.set(
      applicationSettingKey(settingKey),
      settingValue,
      3600,
    );

    this.logger.debug(
      `Application setting for key: ${settingKey} saved to Redis with TTL of 3600 seconds.`,
    );
  }
}
