import { AccessTypeEnum } from '../enums/access-type.enum';

export type BufferUploadMetadata = {
  buffer: Buffer;
  accessType: AccessTypeEnum;
  contentType: string;
  originalName: string;
  extension: string;
  mimeType: string;
  ownerId: string;
};
