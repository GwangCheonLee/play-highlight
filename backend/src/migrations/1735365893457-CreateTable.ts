import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ApplicationSetting } from '../application-setting/entities/application-setting.entity';
import { ApplicationSettingKeyEnum } from '../application-setting/enums/application-setting-key.enum';
import { hashPlainText } from '../common/constants/encryption.constant';
import { UserRole } from '../user/enums/role.enum';

export class CreateTable1735365893457 implements MigrationInterface {
  name = 'CreateTable1735365893457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "file_metadata"
                             (
                                 "key"              character varying(36)  NOT NULL,
                                 "bucket_name"      character varying(255) NOT NULL,
                                 "original_name"    character varying(255) NOT NULL,
                                 "extension"        character varying(10)  NOT NULL,
                                 "storage_location" character varying(255) NOT NULL,
                                 "mime_type"        character varying(100) NOT NULL,
                                 "file_size"        bigint                 NOT NULL,
                                 "checksum"         character varying(40)  NOT NULL,
                                 "is_deleted"       boolean                NOT NULL DEFAULT false,
                                 "createdAt"        TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updatedAt"        TIMESTAMP              NOT NULL DEFAULT now(),
                                 "owner_id"         uuid                   NOT NULL,
                                 CONSTRAINT "PK_563b3bf09a6fa7bccea74d3ec03" PRIMARY KEY ("key")
                             )`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('USER', 'ADMIN', 'ROOT')`,
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
    await queryRunner.query(
      `CREATE TYPE "public"."videos_status_enum" AS ENUM('ORIGINAL_UPLOADED', 'THUMBNAIL_GENERATED', 'HLS_ENCODING_COMPLETED')`,
    );
    await queryRunner.query(`CREATE TABLE "videos"
                             (
                                 "id"                      uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "title"                   character varying NOT NULL,
                                 "video_hls_file_location" character varying,
                                 "is_deleted"              boolean           NOT NULL DEFAULT false,
                                 "status"                  "public"."videos_status_enum",
                                 "createdAt"               TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updatedAt"               TIMESTAMP         NOT NULL DEFAULT now(),
                                 "owner_id"                uuid              NOT NULL,
                                 "thumbnail_metadata_key"  character varying(36),
                                 "origin_metadata_key"     character varying(36),
                                 CONSTRAINT "REL_cb4ecd81bb02c7da8b6e785357" UNIQUE ("thumbnail_metadata_key"),
                                 CONSTRAINT "REL_424b772864b06383f00fc30de8" UNIQUE ("origin_metadata_key"),
                                 CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "application_settings"
                             (
                                 "id"            uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "setting_key"   character varying NOT NULL,
                                 "value_type"    character varying NOT NULL,
                                 "description"   text,
                                 "created_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updated_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                                 "setting_value" text              NOT NULL,
                                 CONSTRAINT "UQ_6dd5c58b55fb3134ddf94f835aa" UNIQUE ("setting_key"),
                                 CONSTRAINT "PK_84c911c1d401de2adbc8060b6d2" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "file_metadata"
        ADD CONSTRAINT "FK_57ad00dd4b3856233cf569954af" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "videos"
        ADD CONSTRAINT "FK_b89ed5035c8cb525f39f7f8b6b9" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "videos"
        ADD CONSTRAINT "FK_cb4ecd81bb02c7da8b6e7853577" FOREIGN KEY ("thumbnail_metadata_key") REFERENCES "file_metadata" ("key") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "videos"
        ADD CONSTRAINT "FK_424b772864b06383f00fc30de84" FOREIGN KEY ("origin_metadata_key") REFERENCES "file_metadata" ("key") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    const manager = queryRunner.manager;
    const hashedPassword = await hashPlainText('changeme');

    await manager.save(User, {
      oauthProvider: null,
      nickname: 'root',
      email: 'root@play-highlight.com',
      password: hashedPassword,
      roles: [UserRole.ROOT],
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

    await manager.save(ApplicationSetting, {
      settingKey: ApplicationSettingKeyEnum.UPLOAD_PROFILE_IMAGE_SIZE_LIMIT,
      _settingValue: '20971520',
      valueType: 'number',
      description: 'Upload profile image size limit',
    });

    await manager.save(ApplicationSetting, {
      settingKey: ApplicationSettingKeyEnum.UPLOAD_THUMBNAIL_IMAGE_SIZE_LIMIT,
      _settingValue: '20971520',
      valueType: 'number',
      description: 'Upload thumbnail image size limit',
    });

    await manager.save(ApplicationSetting, {
      settingKey: ApplicationSettingKeyEnum.USER_STORAGE_LIMIT,
      _settingValue: '10737418240',
      valueType: 'number',
      description: 'User storage limit',
    });

    await manager.save(ApplicationSetting, {
      settingKey: ApplicationSettingKeyEnum.UPLOAD_VIDEO_SIZE_LIMIT,
      _settingValue: '1073741824',
      valueType: 'number',
      description: 'Upload video size limit',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "videos" DROP CONSTRAINT "FK_424b772864b06383f00fc30de84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "videos" DROP CONSTRAINT "FK_cb4ecd81bb02c7da8b6e7853577"`,
    );
    await queryRunner.query(
      `ALTER TABLE "videos" DROP CONSTRAINT "FK_b89ed5035c8cb525f39f7f8b6b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_metadata" DROP CONSTRAINT "FK_57ad00dd4b3856233cf569954af"`,
    );
    await queryRunner.query(`DROP TABLE "application_settings"`);
    await queryRunner.query(`DROP TABLE "videos"`);
    await queryRunner.query(`DROP TYPE "public"."videos_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    await queryRunner.query(`DROP TABLE "file_metadata"`);
  }
}
