import { Injectable, Logger } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

@Injectable()
export class FfmpegService {
  private readonly logger = new Logger(FfmpegService.name);

  /**
   * 동영상에서 썸네일을 생성합니다.
   *
   * @param {string} videoPath - 동영상 파일 경로
   * @param {string} thumbnailPath - 썸네일 파일이 저장될 경로
   * @param {string} timestamp - 썸네일 생성 시점 (기본값: '50%')
   * @param {string} filename - 썸네일 파일 이름 (기본값: 'thumbnail.jpg')
   * @return {Promise<void>} - 프로미스로 성공 또는 실패 반환
   */
  async generateThumbnail(
    videoPath: string,
    thumbnailPath: string,
    timestamp: string = '50%',
    filename: string = 'thumbnail.jpg',
  ): Promise<void> {
    const folderPath = path.dirname(thumbnailPath);

    this.logger.log(`Generating thumbnail for video: ${videoPath}`);
    this.logger.debug(
      `Thumbnail will be saved at: ${folderPath}/${filename}, timestamp: ${timestamp}`,
    );

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timestamp],
          filename,
          folder: folderPath,
        })
        .on('end', () => {
          this.logger.log(
            `Thumbnail generated successfully at ${folderPath}/${filename}`,
          );
          resolve();
        })
        .on('error', (err) => {
          this.logger.error(
            `Failed to generate thumbnail for video: ${videoPath}`,
            err.stack,
          );
          reject(err);
        });
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
