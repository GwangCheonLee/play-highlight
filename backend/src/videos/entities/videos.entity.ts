import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../authentication/entities/users.entity';

@Entity()
export class Videos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.videos)
  user: Users;

  @Column({ name: 'uuid' })
  uuid: string;

  @Column({ name: 'base_dir' })
  baseDir: string;

  @Column({ name: 'thumbnail_path' })
  thumbnailPath: string;

  @Column({ name: 'hls_file_path' })
  hlsFilePath: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
