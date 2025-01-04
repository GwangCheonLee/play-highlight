import { Injectable, Logger } from '@nestjs/common';
import { FileMetadataRepository } from './repositories/file-metadata.repository';
import { FileMetadata } from './entities/file-metadata.entity';

@Injectable()
export class FileMetadataService {
  private readonly logger = new Logger(FileMetadataService.name);

  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
  ) {}

  /**
   * 파일 메타데이터를 가져옵니다.
   *
   * @param {string} bucketName - 버킷 이름
   * @param {string} storageLocation - 저장 위치
   * @param {string} ownerId - 소유자 ID
   * @return {Promise<boolean>}
   */
  getOneFileMetadata(
    bucketName: string,
    storageLocation: string,
    ownerId: string,
  ): Promise<FileMetadata> {
    return this.fileMetadataRepository.findOne({
      where: {
        bucketName,
        storageLocation,
        owner: { id: ownerId },
      },
    });
  }

  /**
   * 파일 메타데이터를 삭제합니다.
   *
   * @param {string} key - 파일 메타데이터 키
   * @return {Promise<void>}
   */
  async deleteFileMetadata(key: string): Promise<void> {
    await this.fileMetadataRepository.delete(key);
  }

  /**
   * 파일 메타데이터를 삭제합니다. (소프트 삭제)
   *
   * @param {string} key - 파일 메타데이터 키
   * @return {Promise<void>}
   */
  async softDeleteFileMetadata(key: string): Promise<void> {
    await this.fileMetadataRepository.update(key, { isDeleted: true });
  }
}
