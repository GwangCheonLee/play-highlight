import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Video } from '../entities/video.entity';

@Injectable()
export class VideoRepository extends Repository<Video> {
  constructor(private dataSource: DataSource) {
    super(Video, dataSource.createEntityManager());
  }
}
