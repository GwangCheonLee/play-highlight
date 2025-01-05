import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoRepository } from './repositories/video.repository';
import { Video } from './entities/video.entity';

@Injectable()
export class VideoService {
  constructor(private readonly videoRepository: VideoRepository) {}

  findVideoById(uuid: string): Promise<Video> {
    const video = this.videoRepository.findOne({
      where: { id: uuid },
      relations: { owner: true, originMetadata: true, thumbnailMetadata: true },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }
}
