import React, {useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {fetchAccessToken} from "../services/authentication/authenticationService";
import {JwtTypes} from "../types/jwtTypes";
import {parseJwt} from "../constatns";


const PrivateRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyAccessToken = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setIsAuthenticated(false);
                return;
            }

            const accessTokenPayload: JwtTypes = parseJwt(accessToken);
            if (Date.now() >= accessTokenPayload.exp * 1000) {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    setIsAuthenticated(false);
                    return;
                }

                const refreshTokenPayload: JwtTypes = parseJwt(refreshToken);
                if (Date.now() >= refreshTokenPayload.exp * 1000) {
                    setIsAuthenticated(false);
                    return;
                }

                try {
                    await fetchAccessToken(refreshToken);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Token refresh failed:", error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(true);
            }
        };

        verifyAccessToken();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet/> : <Navigate to="/"/>;
};

export default PrivateRoute;
