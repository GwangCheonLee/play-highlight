import axios, { AxiosResponse } from "axios";
import {
  fetchFindVideoResponse,
  fetchFindVideosQuery,
  fetchFindVideosResponse,
} from "@/types/videoTypes";

export const fetchFindVideos = async (query: fetchFindVideosQuery) => {
  const params = new URLSearchParams({
    limit: query.limit.toString(),
    ...(query.cursor && { cursor: query.cursor.toString() }),
  }).toString();
  const response: AxiosResponse<fetchFindVideosResponse, any> = await axios.get(
    `/api/videos?${params}`,
  );
  return response.data.data;
};

export const fetchFindVideo = async (uuid: string) => {
  const response: AxiosResponse<fetchFindVideoResponse, any> = await axios.get(
    `/api/videos/${uuid}`,
  );
  return response.data.data;
};

export const fetchUploadVideos = async (
  formData: FormData,
  accessToken: string,
) => {
  const response: AxiosResponse<any, any> = await axios.post(
    `/api/videos`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
};
