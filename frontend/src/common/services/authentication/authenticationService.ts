import axios, {AxiosResponse} from 'axios';
import {
    fetchSignInBody,
    fetchSignInResponse,
    fetchSignUpBody,
    fetchSignUpResponse
} from "../../types/api/authentication/authenticationTypes";


export const fetchSignUp = async (data: fetchSignUpBody) => {
    const response: AxiosResponse<fetchSignUpResponse, any> = await axios.post(`${window.location.origin}/api/authentication/sign-up`, data);
    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("refreshToken", response.data.data.refreshToken);
};

export const fetchSignIn = async (data: fetchSignInBody) => {
    const response: AxiosResponse<fetchSignInResponse, any> = await axios.post(`${window.location.origin}/api/authentication/sign-in`, data);
    localStorage.setItem("accessToken", response.data.data.accessToken);
    if (data.rememberMe) {
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
};


export const fetchAccessToken = async (refreshToken: string) => {
    const response: AxiosResponse<fetchSignInResponse, any> = await axios.get(`${window.location.origin}/api/authentication/access-token`, {
        headers: {Authorization: `Bearer ${refreshToken}`},
    });
    localStorage.setItem("accessToken", response.data.data.accessToken);
};

