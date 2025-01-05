import { Injectable, Logger } from '@nestjs/common';
import {
  Bucket,
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutBucketPolicyCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { S3UploadResult } from './types/s3-upload-result.type';
import { AccessTypeEnum } from '../enums/access-type.enum';

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
      if (error.name === 'NotFound') {
        // S3가 404를 반환하면 파일이 없는 것
        return false;
      }
      this.logger.error('Error checking file existence:', error);
      throw error;
    }
  }

  /**
   * S3에서 특정 키를 가진 폴더를 삭제합니다.
   *
   * @param {string} bucketName 삭제할 폴더가 있는 버킷 이름
   * @param {string} folderKey 삭제할 폴더의 키 (접두사)
   * @return {Promise<void>}
   * @throws {Error} 삭제 중 오류가 발생하면 에러를 던집니다.
   */
  async deleteFolder(bucketName: string, folderKey: string): Promise<void> {
    try {
      let continuationToken: string | undefined;

      do {
        // 해당 폴더 내의 객체 리스트 가져오기
        const command = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: folderKey.endsWith('/') ? folderKey : `${folderKey}/`,
          ContinuationToken: continuationToken,
        });

        const response = await this.s3Client.send(command);

        if (response.Contents && response.Contents.length > 0) {
          // 객체 삭제
          const deleteCommands = response.Contents.map((item) => {
            return this.s3Client.send(
              new DeleteObjectCommand({
                Bucket: bucketName,
                Key: item.Key,
              }),
            );
          });

          // 모든 삭제 작업 병렬 실행
          await Promise.all(deleteCommands);
          this.logger.warn(
            `Deleted ${response.Contents.length} objects from folder: ${folderKey}`,
          );
        }

        continuationToken = response.NextContinuationToken; // 다음 페이지 처리
      } while (continuationToken);

      this.logger.warn(
        `Folder '${folderKey}' deleted successfully from bucket '${bucketName}'`,
      );
    } catch (error) {
      this.logger.error(
        `Error deleting folder '${folderKey}' from bucket '${bucketName}'`,
        error,
      );
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

  /**
   * 특정 유저가 사용하고 있는 스토리지 크기를 계산합니다.
   *
   * @param {string} userId 유저의 ID (폴더 경로)
   * @param {string[]} ignoredExtensions 무시할 확장자 리스트
   * @return {Promise<number>} 유저가 사용 중인 총 스토리지 크기 (바이트 단위)
   */
  async getUserStorageSize(
    userId: string,
    ignoredExtensions: string[] = [],
  ): Promise<number> {
    let totalSize = 0;
    const bucketTypes = [this.publicBucketName, this.privateBucketName];

    try {
      for (const bucketName of bucketTypes) {
        let continuationToken: string | undefined;

        do {
          const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: userId.endsWith('/') ? userId : `${userId}/`, // 폴더 경로
            ContinuationToken: continuationToken,
          });

          const response = await this.s3Client.send(command);

          // 객체 크기 합산, 무시할 확장자 필터링
          if (response.Contents) {
            totalSize += response.Contents.reduce((sum, obj) => {
              const extension = obj.Key?.split('.').pop()?.toLowerCase();
              if (ignoredExtensions.includes(extension)) {
                return sum; // 무시할 확장자라면 합산 제외
              }
              return sum + (obj.Size || 0);
            }, 0);
          }

          continuationToken = response.NextContinuationToken; // 다음 페이지 처리
        } while (continuationToken);
      }

      this.logger.debug(
        `Total storage size for user '${userId}': ${totalSize} bytes`,
      );
      return totalSize;
    } catch (error) {
      this.logger.error(
        `Error calculating storage size for user '${userId}'`,
        error,
      );
      throw error;
    }
  }
}
