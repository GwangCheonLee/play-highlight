import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Video } from '../entities/video.entity';

@Injectable()
export class VideoRepository extends Repository<Video> {
  constructor(private dataSource: DataSource) {
    super(Video, dataSource.createEntityManager());
  }

  async findVideos(
    cursor: number,
    limit: number = 10,
  ): Promise<{ videos: Video[]; nextCursor: number | null }> {
    const queryBuilder = this.createQueryBuilder('videos')
      .leftJoinAndSelect('videos.user', 'user')
      .select([
        'videos.id',
        'videos.uuid',
        'videos.baseDir',
        'videos.thumbnailFileName',
        'videos.hlsFileName',
        'videos.videoFileName',
        'videos.createdAt',
        'videos.updatedAt',
        'user.id',
        'user.role',
        'user.email',
        'user.nickname',
        'user.profileImage',
      ])

      .andWhere('videos.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('videos.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      queryBuilder.where('videos.id <= :cursor', { cursor });
    }

    const videos = await queryBuilder.getMany();

    let nextCursor: number | null = null;
    if (videos.length > limit) {
      nextCursor = videos[videos.length - 1].id;
      videos.pop();
    }

    return { videos, nextCursor };
  }

  async saveVideo(
    user: User,
    uuid: string,
    baseDir: string,
    thumbnailFileName: string,
    hlsFileName: string,
    videoFileName: string,
  ) {
    const entity = this.create({
      user: user,
      uuid,
      baseDir,
      thumbnailFileName,
      hlsFileName,
      videoFileName,
    });

    return this.save(entity);
  }
}
