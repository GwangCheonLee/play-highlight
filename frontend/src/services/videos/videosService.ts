import axios, {AxiosResponse} from 'axios';
import {
  fetchFindVideoResponse,
  fetchFindVideosQuery,
  fetchFindVideosResponse,
  fetchVideoUploadResponse,
  videoDetails,
} from '@/types/videoTypes';

export const fetchFindVideos = async (query: fetchFindVideosQuery) => {
  const params = new URLSearchParams({
    limit: query.limit.toString(),
    ...(query.cursor && {cursor: query.cursor.toString()}),
  }).toString();

  const accessToken = sessionStorage.getItem('accessToken');

  const response: AxiosResponse<fetchFindVideosResponse, any> = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1/videos?${params}`,
    {headers: {Authorization: `Bearer ${accessToken}`}},
  );
  return response.data.data;
};

export const fetchFindVideo = async (uuid: string) => {
  const accessToken = sessionStorage.getItem('accessToken');
  const response: AxiosResponse<fetchFindVideoResponse, any> = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1/videos/${uuid}`,
    {headers: {Authorization: `Bearer ${accessToken}`}},
  );
  return response.data.data as unknown as videoDetails;
};

export const fetchUploadVideos = async (
  formData: FormData,
  accessToken: string,
) => {
  const response: AxiosResponse<fetchVideoUploadResponse, any> =
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1/videos`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  return response.data.data;
};
