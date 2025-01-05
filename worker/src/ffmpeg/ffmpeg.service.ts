import { Injectable, Logger } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'node:fs';
import { EncodingResultInterface } from './interfaces/encoding-result.interface';

@Injectable()
export class FfmpegService {
  private readonly logger = new Logger(FfmpegService.name);

  /**
   * 동영상에서 썸네일을 생성합니다.
   *
   * @param {Buffer} videoBuffer - 동영상 파일 버퍼
   * @param {string} extension - 동영상 파일 확장자 (예: mp4)
   * @param {string} videoKey - UUID로 된 비디오 키
   * @param {string} timestamp - 썸네일 생성 시점 (기본값: '50%')
   * @param {string} thumbnailFilename - 썸네일 파일 이름 (기본값: 'thumbnail.jpg')
   * @return {Promise<void>} - 프로미스로 성공 또는 실패 반환
   */
  async generateThumbnail(
    videoBuffer: Buffer,
    extension: string,
    videoKey: string,
    timestamp: string = '50%',
    thumbnailFilename: string = 'thumbnail.jpg',
  ): Promise<Buffer> {
    const rootTmpPath = path.resolve(__dirname, '../../tmp');
    const videoFolderPath = path.join(rootTmpPath, videoKey);
    const videoFilePath = path.join(videoFolderPath, `video.${extension}`);
    const thumbnailFilePath = path.join(videoFolderPath, thumbnailFilename);

    try {
      // tmp 및 videoKey 폴더 생성
      if (!fs.existsSync(rootTmpPath)) {
        fs.mkdirSync(rootTmpPath);
      }
      if (!fs.existsSync(videoFolderPath)) {
        fs.mkdirSync(videoFolderPath);
      }

      // 비디오 버퍼를 파일로 저장
      this.logger.log(`Saving video buffer to: ${videoFilePath}`);
      fs.writeFileSync(videoFilePath, videoBuffer);

      this.logger.log(`Generating thumbnail for video: ${videoFilePath}`);
      this.logger.debug(
        `Thumbnail will be saved at: ${thumbnailFilePath}, timestamp: ${timestamp}`,
      );

      // 썸네일 생성
      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoFilePath)
          .screenshots({
            timestamps: [timestamp],
            filename: thumbnailFilename,
            folder: videoFolderPath,
          })
          .on('end', () => {
            this.logger.log(
              `Thumbnail generated successfully at ${thumbnailFilePath}`,
            );
            resolve();
          })
          .on('error', (err) => {
            this.logger.error(
              `Failed to generate thumbnail for video: ${videoFilePath}`,
              err.stack,
            );
            reject(err);
          });
      });

      // 생성된 썸네일 이미지를 Buffer로 읽기
      return fs.readFileSync(thumbnailFilePath);
    } catch (error) {
      this.logger.error(`Error while generating thumbnail: ${error.message}`);
      throw error;
    }
  }

  /**
   * 비디오 파일의 해상도를 가져오는 함수
   *
   * @param {string} videoFilePath - 비디오 파일 경로
   * @return {Promise<number>} - 프로미스로 비디오 해상도 반환
   * @throws {Error} - 비디오 해상도를 가져오지 못한 경우
   */
  async getVideoResolution(videoFilePath: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
        if (err) {
          return reject(err);
        }
        const videoStream = metadata.streams.find(
          (s) => s.codec_type === 'video',
        );
        if (!videoStream || !videoStream.height) {
          return reject(new Error('Unable to determine video resolution.'));
        }
        resolve(videoStream.height);
      });
    });
  }

  /**
   * 비디오 버퍼를 받아 HLS 인코딩을 수행합니다.
   * 병렬 처리를 하였더니 CPU 자원을 너무 많이 소모하여 순차 처리로 변경하였습니다.
   *
   * @param {Buffer} videoBuffer - 비디오 버퍼
   * @param {string} extension - 비디오 확장자
   * @param {string} videoKey - 비디오 키
   * @return {Promise<EncodingResultInterface>} - 프로미스로 인코딩 결과 반환
   * @throws {Error} - 인코딩 중 오류 발생 시
   */
  async encodeToHlsByBuffer(
    videoBuffer: Buffer,
    extension: string,
    videoKey: string,
  ): Promise<EncodingResultInterface> {
    const rootTmpPath = path.resolve(__dirname, '../../tmp');
    const videoFolderPath = path.join(rootTmpPath, videoKey);
    const videoFilePath = path.join(videoFolderPath, `video.${extension}`);
    const hlsMasterFile = path.join(videoFolderPath, 'master.m3u8');

    const resolutions = [360, 480, 720, 1080, 1440, 2160];
    const encodedResolutions: string[] = [];

    try {
      // 디렉토리 생성
      fs.mkdirSync(videoFolderPath, { recursive: true });

      // 비디오 버퍼를 파일로 저장
      fs.writeFileSync(videoFilePath, videoBuffer);

      // 비디오의 원본 해상도 가져오기
      const videoHeight = await this.getVideoResolution(videoFilePath);
      this.logger.debug(`Original video resolution: ${videoHeight}p`);

      // 타겟 해상도 계산
      const targetResolutions = resolutions.filter((res) => res <= videoHeight);

      // HLS 인코딩 순차 처리
      for (const resolution of targetResolutions) {
        const resolutionFolderPath = path.join(
          videoFolderPath,
          `${resolution}p`,
        );
        const hlsFilePath = path.join(resolutionFolderPath, 'index.m3u8');
        const hlsSegmentPath = path.join(
          resolutionFolderPath,
          `${resolution}p_%03d.ts`,
        );

        // 디렉토리 생성
        fs.mkdirSync(resolutionFolderPath, { recursive: true });

        await new Promise<void>((resolve, reject) => {
          ffmpeg(videoFilePath)
            .outputOptions([
              `-vf scale=-2:${resolution}`,
              '-c:v libx264',
              '-c:a aac',
              '-start_number 0',
              '-hls_time 3',
              '-hls_list_size 0',
              '-hls_segment_filename',
              hlsSegmentPath,
              '-f hls',
            ])
            .output(hlsFilePath)
            .on('start', (commandLine) => {
              this.logger.debug(`FFmpeg command: ${commandLine}`);
            })
            .on('end', () => {
              this.logger.log(`HLS encoding done for: ${resolution}p`);
              encodedResolutions.push(`${resolution}p`);
              resolve();
            })
            .on('error', (err) => {
              this.logger.error(`Error encoding HLS: ${resolution}p`, err);
              reject(err);
            })
            .run();
        });
      }

      // 마스터 플레이리스트 생성
      const masterPlaylistContent =
        '#EXTM3U\n' +
        targetResolutions
          .map(
            (resolution) =>
              `#EXT-X-STREAM-INF:BANDWIDTH=${resolution * 1000},RESOLUTION=1280x${resolution}\n${resolution}p/index.m3u8`,
          )
          .join('\n');
      fs.writeFileSync(hlsMasterFile, masterPlaylistContent);

      this.logger.log(`Master playlist generated`);

      return {
        encodedResolutions,
        videoFolderPath,
      };
    } catch (error) {
      this.logger.error(`Error in HLS encoding: ${error.message}`);
      throw error;
    }
  }
}
