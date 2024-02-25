import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Videos } from '../entities/videos.entity';

@Injectable()
export class VideosRepository extends Repository<Videos> {
  constructor(private dataSource: DataSource) {
    super(Videos, dataSource.createEntityManager());
  }

  async findVideos(
    cursor: number = 1,
    limit: number = 10,
  ): Promise<{ videos: Videos[]; nextCursor: number | null }> {
    const queryBuilder = this.createQueryBuilder('videos')
      .leftJoinAndSelect('videos.user', 'user')
      .select([
        'videos.id',
        'videos.filePath',
        'videos.isDeleted',
        'videos.createdAt',
        'videos.updatedAt',
        'user.id',
        'user.email',
        'user.nickname',
      ])
      .where('videos.id >= :cursor', { cursor })
      .andWhere('videos.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('videos.id', 'ASC')
      .take(limit + 1);

    const videos = await queryBuilder.getMany();

    let nextCursor: number | null = null;
    if (videos.length > limit) {
      nextCursor = videos.pop().id;
    }

    return { videos, nextCursor };
  }
}
