import { Injectable } from '@nestjs/common';
import { VideosRepository } from './repositories/videos.repository';
import { FindVideosDto } from './dto/findVideos.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

import { Users } from '../authentication/entities/users.entity';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';

@Injectable()
export class VideosService {
  constructor(
    private readonly videosRepository: VideosRepository,
    private readonly ffmpegService: FfmpegService,
  ) {}

  findVideos(findVideosDto: FindVideosDto) {
    return this.videosRepository.findVideos(
      findVideosDto.cursor,
      findVideosDto.limit,
    );
  }

  findVideo(uuid: string) {
    return this.videosRepository.findOne({ where: { uuid } });
  }

  async saveVideo(user: Users, file: Express.Multer.File) {
    const uuid = uuidv4();
    const baseDir = path.resolve(__dirname, '..', '..', 'data');
    const userDir = path.join(baseDir, uuid);
    const originalFilePath = path.join(
      userDir,
      `video${path.extname(file.originalname)}`,
    );
    const thumbnailFilePath = path.join(userDir, 'thumbnail.jpg');
    const hlsOutputDir = userDir;

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    fs.writeFileSync(originalFilePath, file.buffer);

    await this.ffmpegService.generateThumbnail(
      originalFilePath,
      thumbnailFilePath,
    );
    await this.ffmpegService.encodeToHls(originalFilePath, hlsOutputDir);

    return this.videosRepository.saveVideo(user, uuid, baseDir);
  }
}
