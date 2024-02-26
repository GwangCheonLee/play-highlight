import {User} from "../../jwtTypes";

export type fetchFindVideosQuery = {
    cursor: number;
    limit: number;
}


export type fetchFindVideoResponse = {
    data: {
        video: videoDetails;
    }
}

export type fetchFindVideosResponse = {
    data: {
        videos: videoDetails[];
        nextCursor: number | null;
    }
}

export type videoDetails = {
    id: number,
    uuid: string,
    baseDir: string,
    thumbnailPath: string
    hlsFilePath: string
    createdAt: Date,
    updatedAt: Date,
    user: User
}