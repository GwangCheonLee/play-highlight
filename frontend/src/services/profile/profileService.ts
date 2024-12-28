import axios, { AxiosResponse } from "axios";
import { UploadProfileResponse } from "@/types/profileTypes";

export const fetchUploadProfileImage = async (
  formData: FormData,
  accessToken: string,
) => {
  const response: AxiosResponse<UploadProfileResponse, any> = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/users/me/profile/image`,
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

export const fetchDeleteProfileImage = async (accessToken: string) => {
  const response: AxiosResponse<UploadProfileResponse, any> =
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/users/me/profile/image`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  return response.data.data;
};
