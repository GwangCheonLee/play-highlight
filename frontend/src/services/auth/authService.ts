import axios, { AxiosResponse } from "axios";
import {
  ChangeNicknameResponse,
  SignInBody,
  SignInResponse,
  SignUpBody,
  SignUpResponse,
} from "@/types/auth/authTypes";

export const fetchSignUp = async (data: SignUpBody) => {
  const response: AxiosResponse<SignUpResponse, any> = await axios.post(
    `${window.location.origin}/api/authentication/sign-up`,
    data,
  );
  return response.data.data;
};

export const fetchSignIn = async (data: SignInBody) => {
  const response: AxiosResponse<SignUpResponse, any> = await axios.post(
    `${window.location.origin}/api/authentication/sign-in`,
    data,
  );
  return response.data.data;
};

export const fetchAccessToken = async () => {
  const response: AxiosResponse<SignInResponse, any> = await axios.get(
    `${window.location.origin}/api/authentication/access-token`,
  );
  return response.data.data;
};

export const fetchSignOut = async (accessToken: string) => {
  const response: AxiosResponse<null, any> = await axios.post(
    `${window.location.origin}/api/authentication/sign-out`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

export const fetchChangeNickname = async (
  accessToken: string,
  nickname: string,
) => {
  const response: AxiosResponse<ChangeNicknameResponse, any> =
    await axios.patch(
      `${window.location.origin}/api/authentication/me/nickname`,
      { nickname },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  return response.data.data;
};
