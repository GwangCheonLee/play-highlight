import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Video } from '../entities/video.entity';

@Injectable()
export class VideoRepository extends Repository<Video> {
  constructor(private dataSource: DataSource) {
    super(Video, dataSource.createEntityManager());
  }

  async findVideos(
    cursor: string | null,
    limit: number = 10,
  ): Promise<{ videos: Video[]; nextCursor: string | null }> {
    const queryBuilder = this.createQueryBuilder('videos')
      .leftJoinAndSelect('videos.owner', 'user')
      .leftJoinAndSelect('videos.thumbnailMetadata', 'tumbnailMetadata')
      .leftJoinAndSelect('videos.originMetadata', 'originMetadata')
      .select()
      .andWhere('videos.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('videos.status = :status', { status: 'HLS_ENCODING_COMPLETED' })
      .orderBy('videos.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      queryBuilder.andWhere('videos.id < :cursor', { cursor });
    }

    const videos = await queryBuilder.getMany();

    let nextCursor: string | null = null;
    if (videos.length > limit) {
      nextCursor = videos[videos.length - 1].id;
      videos.pop();
    }

    return { videos, nextCursor };
  }
}
