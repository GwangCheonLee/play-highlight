import axios, { AxiosResponse } from "axios";
import { UploadProfileResponse } from "@/types/profileTypes";

export const fetchUploadProfileImage = async (
  formData: FormData,
  accessToken: string,
) => {
  const response: AxiosResponse<UploadProfileResponse, any> = await axios.patch(
    `/api/users/me/profile/image`,
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
