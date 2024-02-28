import axios from 'axios';

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

export default api;
