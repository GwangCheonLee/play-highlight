import { Module } from '@nestjs/common';
import { ApplicationSettingRepository } from './repositories/application-setting.repository';

/*
 * ApplicationSetting 모듈은 애플리케이션 설정과 관련된 모든 기능을 담당하는 모듈입니다.
 */
@Module({
  providers: [ApplicationSettingRepository],
  exports: [ApplicationSettingRepository],
})
export class ApplicationSettingModule {}
