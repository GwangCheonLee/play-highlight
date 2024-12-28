import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ApplicationSetting } from '../application-setting/entities/application-setting.entity';
import { ApplicationSettingKeyEnum } from '../application-setting/enums/application-setting-key.enum';
import { hashPlainText } from '../common/constants/encryption.constant';
import { UserRole } from '../user/enums/role.enum';

export class CreateTable1735365893457 implements MigrationInterface {
  name = 'CreateTable1735365893457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('USER', 'ADMIN')`,
    );
    await queryRunner.query(`CREATE TABLE "users"
                             (
                                 "id"                               uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "oauth_provider"                   character varying,
                                 "roles"                            "public"."users_roles_enum" array NOT NULL DEFAULT '{USER}',
                                 "email"                            character varying NOT NULL,
                                 "password"                         character varying,
                                 "nickname"                         character varying NOT NULL,
                                 "profile_image"                    character varying,
                                 "is_active"                        boolean           NOT NULL DEFAULT true,
                                 "two_factor_authentication_secret" character varying,
                                 "createdAt"                        TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updatedAt"                        TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                                 CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "videos"
                             (
                                 "id"                  uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "uuid"                character varying NOT NULL,
                                 "base_dir"            character varying NOT NULL,
                                 "thumbnail_file_name" character varying NOT NULL,
                                 "hls_file_name"       character varying NOT NULL,
                                 "video_file_name"     character varying NOT NULL,
                                 "is_deleted"          boolean           NOT NULL DEFAULT false,
                                 "createdAt"           TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updatedAt"           TIMESTAMP         NOT NULL DEFAULT now(),
                                 "userId"              uuid,
                                 CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "application_settings"
                             (
                                 "id"            uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "setting_key"   character varying NOT NULL,
                                 "setting_value" text              NOT NULL,
                                 "value_type"    character varying NOT NULL,
                                 "description"   text,
                                 "created_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updated_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "UQ_6dd5c58b55fb3134ddf94f835aa" UNIQUE ("setting_key"),
                                 CONSTRAINT "PK_84c911c1d401de2adbc8060b6d2" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "videos"
        ADD CONSTRAINT "FK_9003d36fcc646f797c42074d82b" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    const manager = queryRunner.manager;
    const hashedPassword = await hashPlainText('changeme');

    await manager.save(User, {
      oauthProvider: null,
      nickname: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      roles: [UserRole.USER, UserRole.ADMIN],
      profileImage: null,
      isActive: true,
      twoFactorAuthenticationSecret: null,
    });

    await manager.save(ApplicationSetting, {
      settingKey: ApplicationSettingKeyEnum.SIGN_UP_RESTRICTION,
      _settingValue: 'false',
      valueType: 'boolean',
      description: 'Sign up restriction',
    });

    await manager.save(ApplicationSetting, {
      settingKey: ApplicationSettingKeyEnum.DUPLICATE_LOGIN_PREVENTION,
      _settingValue: 'false',
      valueType: 'boolean',
      description: 'Duplicate login prevention',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "videos" DROP CONSTRAINT "FK_9003d36fcc646f797c42074d82b"`,
    );
    await queryRunner.query(`DROP TABLE "application_settings"`);
    await queryRunner.query(`DROP TABLE "videos"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
  }
}
