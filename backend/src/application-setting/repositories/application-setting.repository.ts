import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationSetting } from '../entities/application-setting.entity';
import { ApplicationSettingKeyEnum } from '../enums/application-setting-key.enum';

/*
 * ApplicationSettingRepository는 ApplicationSetting 엔티티에 대한 데이터베이스 작업을 수행합니다.
 */
@Injectable()
export class ApplicationSettingRepository extends Repository<ApplicationSetting> {
  constructor(dataSource: DataSource) {
    super(ApplicationSetting, dataSource.createEntityManager());
  }

  /**
   * 주어진 settingKey로 설정을 찾습니다.
   * @param {ApplicationSettingKeyEnum} settingKey - 찾을 설정의 키
   * @return {Promise<ApplicationSetting>} - 찾은 설정
   */
  async findOneByKey(
    settingKey: ApplicationSettingKeyEnum,
  ): Promise<ApplicationSetting> {
    const applicationSetting: ApplicationSetting = await this.findOneBy({
      settingKey,
    });

    if (!applicationSetting) {
      throw new NotFoundException(`Setting with key ${settingKey} not found.`);
    }

    return applicationSetting;
  }
}
