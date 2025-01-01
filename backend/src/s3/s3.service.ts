import { Injectable, Logger } from '@nestjs/common';
import {
  Bucket,
  CreateBucketCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  ListBucketsCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;

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
  }

  /**
   * S3 버킷 목록을 조회합니다.
   *
   * @return {Promise<Bucket[]>} S3 버킷 목록
   * @throws {Error} 조회 중 오류가 발생하면 에러를 던집니다.
   */
  async getBucketList(): Promise<Bucket[]> {
    const command = new ListBucketsCommand({});
    try {
      const response = await this.s3Client.send(command);
      return response.Buckets;
    } catch (error) {
      this.logger.error('Error listing buckets:', error);
      throw error;
    }
  }

  /**
   * 특정 버킷이 존재하는지 확인합니다.
   *
   * @param {string} bucketName 확인할 버킷 이름
   * @return {Promise<boolean>} 버킷 존재 여부
   */
  async isBucketExists(bucketName: string): Promise<boolean> {
    const buckets = await this.getBucketList();
    return buckets.some((bucket) => bucket.Name === bucketName);
  }

  /**
   * S3에 Private 버킷을 생성합니다.
   *
   * @param {string} bucketName 생성할 버킷 이름
   * @return {Promise<void>}
   */
  async createPrivateBucket(bucketName: string): Promise<void> {
    try {
      await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        }),
      );

      this.logger.log(`Private bucket created: ${bucketName}`);
    } catch (error) {
      if (error.name === 'MalformedXML') {
        this.logger.error(
          'Malformed XML in request. Check the request body or headers.',
        );
      }
      this.logger.error(`Error creating private bucket ${bucketName}:`, error);
      throw error;
    }
  }

  /**
   * S3에 Public 버킷을 생성합니다.
   *
   * @param {string} bucketName 생성할 버킷 이름
   * @return {Promise<void>}
   */
  async createPublicBucket(bucketName: string): Promise<void> {
    try {
      // 1. 버킷 생성
      await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        }),
      );

      // 2. 퍼블릭 읽기 버킷 정책 설정
      const publicReadPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${bucketName}/*`,
          },
        ],
      };

      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: bucketName,
          Policy: JSON.stringify(publicReadPolicy),
        }),
      );

      this.logger.log(`Public bucket created: ${bucketName}`);
    } catch (error) {
      this.logger.error(`Error creating public bucket ${bucketName}:`, error);
      throw error;
    }
  }

  /**
   * S3에 파일을 업로드합니다.
   *
   * @param {string} bucketName 업로드할 버킷 이름
   * @param {string} key 파일의 키(이름)
   * @param {Buffer | Readable | string} body 업로드할 파일의 내용
   * @param {string} contentType 파일의 MIME 타입
   * @return {Promise<string>} 업로드한 파일의 ETag
   * @throws {Error} 업로드 중 오류가 발생하면 에러를 던집니다.
   */
  async upload(
    bucketName: string,
    key: string,
    body: Buffer | Readable | string,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    try {
      const response: PutObjectCommandOutput =
        await this.s3Client.send(command);
      this.logger.log(`File uploaded successfully to ${bucketName}/${key}`);

      return response.ETag;
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
   * S3에서 다운로드를 위한 서명된 URL을 생성합니다.
   *
   * @param {string} bucketName 다운로드할 버킷 이름
   * @param {string} key 다운로드할 파일의 키(이름)
   * @param {number} expiresIn URL의 유효 시간(초 단위)
   * @return {Promise<string>} 생성된 서명된 URL
   * @throws {Error} URL 생성 중 오류가 발생하면 에러를 던집니다.
   */
  async generateSignedDownloadUrl(
    bucketName: string,
    key: string,
    expiresIn: number,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      this.logger.log(`Generated presigned URL for download: ${url}`);
      return url;
    } catch (error) {
      this.logger.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  /**
   * S3에 파일 업로드를 위한 서명된 URL을 생성합니다.
   *
   * @param {string} bucketName 업로드할 버킷 이름
   * @param {string} key 업로드할 파일의 키(이름)
   * @param {number} expiresIn URL의 유효 시간(초 단위)
   * @return {Promise<string>} 생성된 서명된 URL
   * @throws {Error} URL 생성 중 오류가 발생하면 에러를 던집니다.
   */
  async generateSignedUploadUrl(
    bucketName: string,
    key: string,
    expiresIn: number,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      this.logger.log(`Generated signed URL for upload: ${url}`);
      return url;
    } catch (error) {
      this.logger.error('Error generating signed URL:', error);
      throw error;
    }
  }
}
