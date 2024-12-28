import { Injectable } from '@nestjs/common';
import { FindVideosDto } from './dto/find-videos.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';
import { getBaseDir } from '../common/constants/common.constant';
import { VideoRepository } from './repositories/video.repository';
import { User } from '../user/entities/user.entity';

@Injectable()
export class VideoService {
  constructor(
    private readonly ffmpegService: FfmpegService,
    private readonly videoRepository: VideoRepository,
  ) {}

  findVideos(findVideosDto: FindVideosDto) {
    return this.videoRepository.findVideos(
      findVideosDto.cursor,
      findVideosDto.limit,
    );
  }

  findVideo(uuid: string) {
    return this.videoRepository.findOne({ where: { uuid } });
  }

  async saveVideo(user: User, file: Express.Multer.File) {
    const uuid = uuidv4();
    const baseDir = path.join(getBaseDir(), 'videos');
    const videoDirPath = path.join(baseDir, uuid);
    const fileExtension = path.extname(file.originalname);

    const thumbnailFileName = 'thumbnail.jpg';
    const hlsFileName = 'output.m3u8';
    const videoFileName = `video${fileExtension}`;

    const originalVideoPath = path.join(videoDirPath, videoFileName);
    const thumbnailPath = path.join(videoDirPath, thumbnailFileName);
    const hlsOutputPath = path.join(videoDirPath, hlsFileName);

    fs.mkdirSync(videoDirPath, { recursive: true });
    fs.writeFileSync(originalVideoPath, file.buffer);

    await this.ffmpegService.generateThumbnail(
      originalVideoPath,
      thumbnailPath,
    );
    await this.ffmpegService.encodeToHls(originalVideoPath, hlsOutputPath);

    return this.videoRepository.saveVideo(
      user,
      uuid,
      baseDir,
      thumbnailFileName,
      hlsFileName,
      videoFileName,
    );
  }
}
