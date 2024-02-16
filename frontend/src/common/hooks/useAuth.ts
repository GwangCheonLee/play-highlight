import {parseJwt} from "../commom.constant";

export const useAuth = () => {
    const token = localStorage.getItem('accessToken');
    const payload = parseJwt(token);
    if (!payload) return {isAuthenticated: false};
    
    const currentTime = Date.now() / 1000;
    return {
        isAuthenticated: payload.exp > currentTime,
    };
};