import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

@Injectable()
export class FfmpegService {
  generateThumbnail(videoPath: string, thumbnailPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['50%'],
          filename: 'thumbnail.jpg',
          folder: path.dirname(thumbnailPath),
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }

  encodeToHls(videoPath: string, hlsOutputDir: string): Promise<void> {
    const hlsOutputPath = path.join(hlsOutputDir, 'output.m3u8');
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          '-codec: copy',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls',
        ])
        .output(hlsOutputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }
}
