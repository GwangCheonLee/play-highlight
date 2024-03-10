import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Videos } from '../../videos/entities/videos.entity';
import { USER_ROLE } from '../../common/enums/role.enum';

@Entity()
export class Users {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Videos, (video) => video.user)
  videos: Videos[];
}
