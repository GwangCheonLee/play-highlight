import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('file_metadata')
export class FileMetadata {
  /**
   * 파일의 고유 키 (UUID v4).
   * DB에서 자동 생성되지 않으며, 애플리케이션에서 생성/주입합니다.
   * @type {string}
   */
  @PrimaryColumn({ type: 'varchar', name: 'key', length: 36 })
  key: string;

  /**
   * 파일이 저장된 버킷 이름을 나타냅니다.
   * @type {string}
   */
  @Column({ type: 'varchar', name: 'bucket_name', length: 255 })
  bucketName: string;

  /**
   * 파일의 원본 이름을 나타냅니다.
   * @type {string}
   */
  @Column({ type: 'varchar', name: 'original_name', length: 255 })
  originalName: string;

  /**
   * 파일의 확장자를 나타냅니다.
   * @type {string}
   */
  @Column({ type: 'varchar', name: 'extension', length: 10 })
  extension: string;

  /**
   * 파일이 저장된 경로를 나타냅니다.
   * @type {string}
   */
  @Column({ type: 'varchar', name: 'storage_location', length: 255 })
  storageLocation: string;

  /**
   * 파일의 MIME 타입을 나타냅니다.
   * @type {string}
   */
  @Column({ type: 'varchar', name: 'mime_type', length: 100 })
  mimeType: string;

  /**
   * 파일의 크기를 나타냅니다.
   * @type {number}
   */
  @Column({ type: 'bigint', name: 'file_size' })
  size: number;

  /**
   * 파일의 해시값을 나타냅니다.
   * @type {string}
   */
  @Column({ type: 'varchar', name: 'checksum', length: 40 })
  checksum: string; // 파일 무결성 검증용

  /**
   * 파일의 공개 여부를 나타냅니다.
   * 기본값은 `true`입니다.
   * @type {boolean}
   */
  @Column({ type: 'boolean', name: 'is_public', default: true })
  isPublic: boolean;

  /**
   * 파일의 삭제 여부를 나타냅니다.
   * 기본값은 `false`입니다.
   * @type {boolean}
   */
  @Column({ type: 'boolean', name: 'is_deleted', default: false })
  isDeleted: boolean;

  /**
   * 파일 소유자의 고유 키 (UUID v4).
   * @type {string}
   */
  @ManyToOne(() => User, (user) => user.files, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  /**
   * 사용자가 생성된 날짜 및 시간입니다.
   * 자동으로 설정됩니다.
   * @type {Date}
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 사용자를 마지막으로 수정된 날짜 및 시간입니다.
   * 자동으로 설정됩니다.
   * @type {Date}
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
