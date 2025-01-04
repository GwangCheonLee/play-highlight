import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { S3Module } from './s3/s3.module';
import { FileMetadataModule } from './file-metadata/file-metadata.module';

/**
 * 파일 모듈입니다.
 */
@Module({
  imports: [S3Module, FileMetadataModule],
  providers: [FileService],
  exports: [FileService, S3Module, FileMetadataModule],
})
export class FileModule {}
