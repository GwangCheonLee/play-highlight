import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.videos)
  user: User;

  @Column({ name: 'uuid' })
  uuid: string;

  @Column({ name: 'base_dir' })
  baseDir: string;

  @Column({ name: 'thumbnail_file_name' })
  thumbnailFileName: string;

  @Column({ name: 'hls_file_name' })
  hlsFileName: string;

  @Column({ name: 'video_file_name' })
  videoFileName: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
