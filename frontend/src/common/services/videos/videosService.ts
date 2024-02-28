import {AxiosResponse} from 'axios';
import {fetchFindVideoResponse, fetchFindVideosQuery, fetchFindVideosResponse} from "../../types/api/videos/videoTypes";
import api from "../../utils/axios";

export const fetchFindVideos = async (query: fetchFindVideosQuery) => {
    const params = new URLSearchParams({
        limit: query.limit.toString(),
        ...(query.cursor && {cursor: query.cursor.toString()})
    }).toString();
    const response: AxiosResponse<fetchFindVideosResponse, any> = await api.get(`/api/videos?${params}`);
    return response.data.data;
};

export const fetchFindVideo = async (uuid: string) => {
    const response: AxiosResponse<fetchFindVideoResponse, any> = await api.get(`/api/videos/${uuid}`,);
    return response.data.data
};

export const fetchUploadVideos = async (formData: FormData) => {
    const response: AxiosResponse<any, any> = await api.post(`/api/videos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data.data
};


