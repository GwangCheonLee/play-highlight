import {AxiosResponse} from 'axios';
import {fetchFindVideosQuery, fetchFindVideosResponse} from "../../types/api/videos/videoTypes";
import api from "../../utils/axios";

export const fetchFindVideos = async (query: fetchFindVideosQuery) => {
    const response: AxiosResponse<fetchFindVideosResponse, any> = await api.get(`/api/videos?cursor=${query.cursor}&limit=${query.limit}`,);
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


