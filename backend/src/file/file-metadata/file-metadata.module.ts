import { Module } from '@nestjs/common';
import { FileMetadataRepository } from './repositories/file-metadata.repository';
import { FileMetadataService } from './file-metadata.service';

/**
 * FileMetadataModule 은 파일 메타데이터와 관련된 기능을 제공하는 모듈입니다.
 */
@Module({
  providers: [FileMetadataService, FileMetadataRepository],
  exports: [FileMetadataService, FileMetadataRepository],
})
export class FileMetadataModule {}
