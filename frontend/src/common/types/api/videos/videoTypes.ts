import {User} from "../../jwtTypes";

export type fetchFindVideosQuery = {
    cursor: number;
    limit: number;
}


export type fetchFindVideosResponse = {
    data: {
        videos: videoDetails[];
        nextCursor: number | null;
    }
}

export type videoDetails = {
    id: number,
    thumbnailPath: string
    filePath: string,
    createdAt: Date,
    updatedAt: Date,
    user: User
}