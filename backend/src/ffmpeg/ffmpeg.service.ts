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
        .on('end', (stdout: string | null, stderr: string | null) => {
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }

  encodeToHls(videoPath: string, hlsOutputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          '-codec: copy',
          '-start_number 0',
          '-hls_time 3',
          '-hls_list_size 0',
          '-f hls',
        ])
        .output(hlsOutputPath)
        .on('end', (stdout: string | null, stderr: string | null) => {
          resolve();
        })
        .on('error', (err) => reject(err))
        .run();
    });
  }
}
