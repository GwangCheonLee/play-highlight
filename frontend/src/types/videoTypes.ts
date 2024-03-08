import { User } from "@/types/user";

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

export type videoDetails = {
  id: number;
  uuid: string;
  baseDir: string;
  thumbnailFileName: string;
  hlsFileName: string;
  videoFileName: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};
