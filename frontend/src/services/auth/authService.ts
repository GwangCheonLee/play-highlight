import axios, {AxiosResponse} from 'axios';
import {ChangeNicknameResponse, SignInBody, SignInResponse, SignUpBody, SignUpResponse} from '@/types/authTypes';

export const fetchSignUp = async (data: SignUpBody) => {
  const response: AxiosResponse<SignUpResponse, any> = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1/authentication/sign-up`,
    data,
  );
  return response.data.data;
};

export const fetchSignIn = async (data: SignInBody) => {
  const response: AxiosResponse<SignUpResponse, any> = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1/authentication/sign-in`,
    data,
    {withCredentials: true},
  );
  return response.data.data;
};

export const fetchAccessToken = async () => {
  const response: AxiosResponse<SignInResponse, any> = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1/authentication/access-token`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data.data;
};

export const fetchSignOut = async (accessToken: string) => {
  const response: AxiosResponse<null, any> = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1/authentication/sign-out`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
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
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1/users/me/profile/nickname`,
      {nickname},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  return response.data.data;
};
