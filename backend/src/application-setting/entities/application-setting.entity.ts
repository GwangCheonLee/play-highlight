import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationSettingKeyEnum } from '../enums/application-setting-key.enum';

/**
 * ApplicationSetting 엔티티는 애플리케이션의 동적 설정을 관리합니다.
 */
@Entity('application_settings')
export class ApplicationSetting {
  /**
   * 기본 키 (UUID v4)
   */
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  /**
   * 설정 키 (고유 값)
   * 설정 항목을 고유하게 식별합니다.
   */
  @Column({
    name: 'setting_key',
    unique: true,
    enum: ApplicationSettingKeyEnum,
  })
  settingKey: ApplicationSettingKeyEnum;

  /**
   * 설정 값의 타입
   * 설정 값의 데이터 타입을 나타냅니다.
   */
  @Column({ name: 'value_type', type: 'varchar' })
  valueType: string;

  /**
   * 설정 설명
   * 설정의 목적과 사용 방법을 나타내는 선택적 필드입니다.
   */
  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  /**
   * 설정 생성 시간
   * 엔티티가 생성된 시점을 자동으로 기록합니다.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * 설정 수정 시간
   * 엔티티가 마지막으로 수정된 시점을 자동으로 기록합니다.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * 설정 값
   * 데이터베이스에는 문자열로 저장됩니다.
   * valueType에 따라 값을 동적으로 변환할 수 있습니다.
   */
  @Column({
    name: 'setting_value',
    type: 'text',
    transformer: {
      to: (value: any): string => {
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value?.toString();
      },
      from: (value: string): any => {
        return value;
      },
    },
  })
  private _settingValue: string;

  /**
   * Getter: valueType에 따라 변환된 값을 반환
   */
  get settingValue(): any {
    switch (this.valueType) {
      case 'number':
        return Number(this._settingValue);
      case 'boolean':
        return this._settingValue === 'true';
      case 'json':
        return JSON.parse(this._settingValue);
      default:
        return this._settingValue;
    }
  }

  /**
   * @param {any} value - 설정 값
   * Setter: 입력 값을 문자열로 변환하여 저장
   */
  set settingValue(value: any) {
    switch (this.valueType) {
      case 'number':
      case 'boolean':
        this._settingValue = value.toString();
        break;
      case 'json':
        this._settingValue = JSON.stringify(value);
        break;
      default:
        this._settingValue = value;
    }
  }
}
