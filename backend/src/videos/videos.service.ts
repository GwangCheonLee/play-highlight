import { Injectable } from '@nestjs/common';
import { VideosRepository } from './repositories/videos.repository';
import { FindVideosDto } from './dto/findVideos.dto';

@Injectable()
export class VideosService {
  constructor(private readonly videosRepository: VideosRepository) {}

  findVideos(findVideosDto: FindVideosDto) {
    return this.videosRepository.findVideos(
      findVideosDto.cursor,
      findVideosDto.limit,
    );
  }
}
