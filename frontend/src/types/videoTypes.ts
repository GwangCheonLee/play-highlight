import {User} from '@/types/user';

export type fetchFindVideosQuery = {
  cursor: number | null;
  limit: number;
};

export type fetchFindVideoResponse = {
  data: {
    video: videoDetails;
  };
};

export type fetchFindVideosResponse = {
  data: {
    videos: videoDetails[];
    nextCursor: number | null;
  };
};

export type fetchVideoUploadResponse = {
  data: {
    video: videoDetails;
  };
};

export type videoDetails = {
  id: string;
  baseDir: string;
  thumbnailFileName: string;
  hlsFileName: string;
  videoFileName: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  videoHlsFileLocation: string;
  thumbnailMetadata: {storageLocation: string, extension: string};
  originMetadata: {storageLocation: string, extension: string};
};
