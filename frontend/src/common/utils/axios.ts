import axios from 'axios';
import {fetchAccessToken} from "../services/authentication/authenticationService";
import {logout, parseJwt} from "../constatns";

const api = axios.create({
    baseURL: window.location.origin
});

api.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem("accessToken");
        if (config.headers && accessToken) {
            config.headers.authorization = `Bearer ${accessToken}`;
            return config;
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                return Promise.reject(error);
            }

            const refreshTokenPayload = parseJwt(refreshToken);
            const refreshTokenExpired = refreshTokenPayload.exp * 1000 <= Date.now();
            if (refreshTokenExpired) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            try {
                await fetchAccessToken(refreshToken);
                originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
                return api(originalRequest);
            } catch (refreshError) {
                logout()
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
