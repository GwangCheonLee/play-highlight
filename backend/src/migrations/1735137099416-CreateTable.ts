import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTable1735137099416 implements MigrationInterface {
  name = 'CreateTable1735137099416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users"
                             (
                                 "id"            SERIAL            NOT NULL,
                                 "role"          character varying NOT NULL DEFAULT 'USER',
                                 "email"         character varying NOT NULL,
                                 "password"      character varying NOT NULL,
                                 "nickname"      character varying NOT NULL,
                                 "profile_image" character varying,
                                 "is_disabled"   boolean           NOT NULL DEFAULT false,
                                 "createdAt"     TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updatedAt"     TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                                 CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "videos"
                             (
                                 "id"                  SERIAL            NOT NULL,
                                 "uuid"                character varying NOT NULL,
                                 "base_dir"            character varying NOT NULL,
                                 "thumbnail_file_name" character varying NOT NULL,
                                 "hls_file_name"       character varying NOT NULL,
                                 "video_file_name"     character varying NOT NULL,
                                 "is_deleted"          boolean           NOT NULL DEFAULT false,
                                 "createdAt"           TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updatedAt"           TIMESTAMP         NOT NULL DEFAULT now(),
                                 "userId"              integer,
                                 CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "videos"
        ADD CONSTRAINT "FK_9003d36fcc646f797c42074d82b" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "videos" DROP CONSTRAINT "FK_9003d36fcc646f797c42074d82b"`,
    );
    await queryRunner.query(`DROP TABLE "videos"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
