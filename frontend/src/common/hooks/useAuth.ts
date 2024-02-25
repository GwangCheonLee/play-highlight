import {useEffect, useState} from 'react';
import {User} from "../types/jwtTypes";
import {fetchAccessToken} from "../services/authentication/authenticationService";
import {parseJwt} from "../constatns";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    useEffect(() => {

        if (!accessToken && !refreshToken) {
            logoutUser();
        }

        if (accessToken) {
            const accessTokenPayload = parseJwt(accessToken);
            const accessTokenCurrentTime = Date.now() / 1000;

            if (accessTokenPayload.exp > accessTokenCurrentTime) {
                setIsAuthenticated(true);
                setUser(accessTokenPayload.user);
            } else {
                if (!refreshToken) {
                    logoutUser();
                }

                if (refreshToken) {
                    const refreshTokenPayload = parseJwt(refreshToken);
                    const refreshTokenCurrentTime = Date.now() / 1000;

                    if (refreshTokenPayload.exp > refreshTokenCurrentTime) {
                        refreshAccessToken(refreshToken)
                    } else {
                        logoutUser();
                    }
                }
            }
        }


    }, []);


    const refreshAccessToken = async (refreshToken: string) => {
        try {
            const {accessToken} = await fetchAccessToken(refreshToken);
            localStorage.setItem('accessToken', accessToken);

            const accessTokenPayload = parseJwt(accessToken);
            setIsAuthenticated(true);
            setUser(accessTokenPayload.user);
        } catch (error) {
            console.error('Token refresh failed:', error);
            logoutUser();
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setUser(null);
    };

    return {isAuthenticated, user, accessToken};
};
