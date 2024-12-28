import { Module } from '@nestjs/common';
import { ApplicationSettingRepository } from './repositories/application-setting.repository';

@Module({
  providers: [ApplicationSettingRepository],
  exports: [ApplicationSettingRepository],
})
export class ApplicationSettingModule {}
