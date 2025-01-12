import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { S3UploadResult } from './types/s3-upload-result.type';
import { AccessTypeEnum } from './enums/access-type.enum';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly privateBucketName: string;
  private readonly publicBucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_ACCESS_KEY',
        ),
      },
      endpoint: this.configService.get<string>('AWS_S3_ENDPOINT'),
      forcePathStyle: true,
    });

    this.privateBucketName = `${configService.get<string>('PROJECT_NAME')}-${AccessTypeEnum.PRIVATE}`;
    this.publicBucketName = `${configService.get<string>('PROJECT_NAME')}-${AccessTypeEnum.PUBLIC}`;
  }

  /**
   * S3에 파일을 업로드합니다.
   *
   * @param {string} bucketName 업로드할 버킷 이름
   * @param {string} key 파일의 키(이름)
   * @param {Buffer | Readable | string} body 업로드할 파일의 내용
   * @param {string} contentType 파일의 MIME 타입
   * @return {Promise<S3UploadResult>} 업로드한 파일의 정보
   * @throws {Error} 업로드 중 오류가 발생하면 에러를 던집니다.
   */
  async upload(
    bucketName: string,
    key: string,
    body: Buffer | Readable | string,
    contentType: string,
  ): Promise<S3UploadResult> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    try {
      const response: PutObjectCommandOutput =
        await this.s3Client.send(command);
      this.logger.debug(`File uploaded successfully to ${bucketName}/${key}`);

      return {
        etag: response.ETag,
        location: `${bucketName}/${key}`,
      };
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * S3에서 파일을 다운로드합니다.
   *
   * @param {string} bucketName 다운로드할 버킷 이름
   * @param {string} key 다운로드할 파일의 키(이름)
   * @return {Promise<Buffer>} 다운로드한 파일의 내용
   * @throws {Error} 다운로드 중 오류가 발생하면 에러를 던집니다.
   */
  async download(bucketName: string, key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      const response: GetObjectCommandOutput =
        await this.s3Client.send(command);
      const stream = response.Body as Readable;
      const chunks: any[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error('Error getting file:', error);
      throw error;
    }
  }

  /**
   * 특정 파일이 S3에 존재하는지 확인 (true/false 반환)
   *
   * @param {string} bucketName 파일이 존재하는지 확인할 버킷 이름
   * @param {string} key 파일의 키(이름)
   * @return {Promise<boolean>} 파일 존재 여부
   */
  async isFileExists(bucketName: string, key: string): Promise<boolean> {
    try {
      // 파일 정보 확인을 위해 HeadObjectCommand 사용
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await this.s3Client.send(command);

      return true;
    } catch (error) {
      this.logger.error('Error checking file existence:', error);
      if (error.name === 'NotFound') {
        // S3가 404를 반환하면 파일이 없는 것
        return false;
      }
      throw error;
    }
  }

  /**
   * S3에서 특정 파일을 삭제
   *
   * @param {string} bucketName 삭제할 파일이 있는 버킷 이름
   * @param {string} key 삭제할 파일의 키(이름)
   * @return {Promise<void>}
   */
  async deleteFile(bucketName: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    try {
      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully from ${bucketName}/${key}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }
}
