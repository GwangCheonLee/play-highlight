import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FileMetadata } from '../../file/file-metadata/entities/file-metadata.entity';
import { VideoUploadStatus } from '../enums/video-upload-status.enum';

@Entity('videos')
export class Video {
  /**
   * 비디오의 고유 식별자 (UUID v4)
   * @type {string}
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 비디오 소유자의 고유 키 (UUID v4)
   * @type {string}
   */
  @ManyToOne(() => User, (user) => user.videos, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  /**
   * 비디오의 제목입니다.
   * @type {string}
   */
  @Column({ type: 'varchar', name: 'title' })
  title: string;

  /**
   * 비디오의 Thumbnail 파일 메타데이터 입니다.
   * @type {string}
   */
  @OneToOne(() => FileMetadata)
  @JoinColumn({ name: 'thumbnail_metadata_key' })
  thumbnailMetadata: FileMetadata; // 썸네일 파일 메타데이터

  /**
   * 비디오의 원본 파일 메타데이터 입니다.
   * @type {string}
   */
  @OneToOne(() => FileMetadata)
  @JoinColumn({ name: 'origin_metadata_key' })
  originMetadata: FileMetadata; // 원본 비디오 파일 메타데이터

  /**
   * 비디오의 HLS 파일 경로 입니다.
   * @type {string}
   */
  @Column({ type: 'varchar', name: 'video_hls_file_location', nullable: true })
  videoHlsFileLocation: string;

  /**
   * 비디오의 삭제 여부를 나타냅니다.
   * 기본값은 `false`입니다.
   * @type {boolean}
   */
  @Column({ type: 'boolean', name: 'is_deleted', default: false })
  isDeleted: boolean;

  /**
   * 비디오 업로드 상태입니다.
   *
   * @type {VideoUploadStatus}
   */
  @Column({
    type: 'enum',
    enum: VideoUploadStatus,
    name: 'status',
    default: null,
  })
  status: VideoUploadStatus;

  /**
   * 비디오가 생성된 날짜 및 시간입니다.
   * 자동으로 설정됩니다.
   * @type {Date}
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 비디오를 마지막으로 수정된 날짜 및 시간입니다.
   * 자동으로 설정됩니다.
   * @type {Date}
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
