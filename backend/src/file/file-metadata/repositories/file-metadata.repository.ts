import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FileMetadata } from '../entities/file-metadata.entity';

@Injectable()
export class FileMetadataRepository extends Repository<FileMetadata> {
  constructor(dataSource: DataSource) {
    super(FileMetadata, dataSource.createEntityManager());
  }
}
