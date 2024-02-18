import {parseJwt} from "../constatns";

export const useAuth = () => {
    const token = localStorage.getItem('accessToken');
    const payload = parseJwt(token);
    if (!payload) return {isAuthenticated: false, user: null};
    
    const currentTime = Date.now() / 1000;
    return {
        user: payload.user,
        isAuthenticated: payload.exp > currentTime,
    };
};