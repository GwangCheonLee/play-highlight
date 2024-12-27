import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { USER_ROLE } from '../../common/enum/role.enum';
import { Video } from '../../video/entities/video.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'nickname' })
  nickname: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage: string | null;

  @Column('boolean', { name: 'is_disabled', default: false })
  isDisabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];
}
