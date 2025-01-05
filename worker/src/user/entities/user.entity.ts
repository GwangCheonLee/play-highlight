import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Video } from '../../video/entities/video.entity';
import { UserRole } from '../enums/role.enum';
import { Exclude } from 'class-transformer';
import { FileMetadata } from '../../file-metadata/entities/file-metadata.entity';

/**
 * User 엔티티 클래스입니다.
 * 이 클래스는 데이터베이스의 'users' 테이블과 매핑됩니다.
 */
@Entity('users')
export class User {
  /**
   * 사용자의 고유 식별자 (UUID v4)
   * @type {string}
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * OAuth 인증 공급자의 이름입니다.
   * 선택 사항으로, 값이 없을 경우 `null`로 저장됩니다.
   * @type {string | null}
   */
  @Column({ name: 'oauth_provider', nullable: true })
  oauthProvider?: string | null;

  /**
   * 사용자의 역할 목록입니다.
   * 기본값은 일반 사용자(USER)입니다.
   * @type {UserRole[]}
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.USER],
  })
  roles: UserRole[];

  /**
   * 사용자의 이메일 주소입니다.
   * 고유해야 하며, 로그인에 사용됩니다.
   * @type {string}
   */
  @Column({ name: 'email', unique: true })
  email: string;

  /**
   * 사용자의 비밀번호입니다.
   * 보안상의 이유로 반드시 암호화된 형태로 저장되어야 합니다.
   * @type {string | null}
   */
  @Exclude()
  @Column({ name: 'password', nullable: true })
  password: string | null;

  /**
   * 사용자의 닉네임입니다.
   * 애플리케이션에서 사용자를 식별할 때 사용됩니다.
   * @type {string}
   */
  @Column({ name: 'nickname' })
  nickname: string;

  /**
   * 사용자의 프로필 이미지 URL입니다.
   * 선택 사항으로, 값이 없을 경우 `null`로 저장됩니다.
   * @type {string | null}
   */
  @Column({ name: 'profile_image', nullable: true })
  profileImage: string | null;

  /**
   * 사용자의 활성 상태를 나타냅니다.
   * 기본값은 `true`입니다.
   * @type {boolean}
   */
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  /**
   * 사용자의 2단계 인증 비밀키입니다.
   * 선택 사항으로, 값이 없을 경우 `null`로 저장됩니다.
   * @type {string | null}
   */
  @Column({ name: 'two_factor_authentication_secret', nullable: true })
  twoFactorAuthenticationSecret?: string | null;

  /**
   * 사용자가 업로드한 비디오 목록입니다.
   * @type {Video[]}
   */
  @OneToMany(() => Video, (video) => video.owner)
  videos: Video[];

  /**
   * 사용자가 소유한 파일 목록.
   * OneToMany로 FileMetadata와 연결.
   */
  @OneToMany(() => FileMetadata, (file) => file.owner)
  files: FileMetadata[];

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
