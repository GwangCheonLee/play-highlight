import axios, {AxiosResponse} from 'axios';
import {fetchFindVideosQuery, fetchFindVideosResponse} from "../../types/api/videos/videoTypes";

const apiHost = process.env.REACT_APP_BACKEND_HOST;

export const fetchFindVideos = async (query: fetchFindVideosQuery, accessToken: string) => {
    const response: AxiosResponse<fetchFindVideosResponse, any> = await axios.get(`${apiHost}/api/videos?cursor=${query.cursor}&limit=${query.limit}`, {headers: {Authorization: `Bearer ${accessToken}`}});
    return response.data.data
};