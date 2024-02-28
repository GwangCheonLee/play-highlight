import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Videos } from '../entities/videos.entity';
import { Users } from '../../authentication/entities/users.entity';

@Injectable()
export class VideosRepository extends Repository<Videos> {
  constructor(private dataSource: DataSource) {
    super(Videos, dataSource.createEntityManager());
  }

  async findVideos(
    cursor: number,
    limit: number = 10,
  ): Promise<{ videos: Videos[]; nextCursor: number | null }> {
    const queryBuilder = this.createQueryBuilder('videos')
      .leftJoinAndSelect('videos.user', 'user')
      .select([
        'videos.id',
        'videos.uuid',
        'videos.baseDir',
        'videos.thumbnailPath',
        'videos.hlsFilePath',
        'videos.createdAt',
        'videos.updatedAt',
        'user.id',
        'user.email',
        'user.nickname',
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

  async saveVideo(user: Users, uuid: string, baseDir: string) {
    const entity = this.create({
      user: user,
      uuid,
      baseDir,
      thumbnailPath: `${uuid}/thumbnail.jpg`,
      hlsFilePath: `${uuid}/output.m3u8`,
    });

    return this.save(entity);
  }
}
