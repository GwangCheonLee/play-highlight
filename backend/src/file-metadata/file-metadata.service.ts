import { Injectable, Logger } from '@nestjs/common';
import { FileMetadataRepository } from './repositories/file-metadata.repository';

@Injectable()
export class FileMetadataService {
  private readonly logger = new Logger(FileMetadataService.name);

  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
  ) {}

  // FileMetadata 데이터베이스에 저장하기

  async saveFileMetadata() {}
}
