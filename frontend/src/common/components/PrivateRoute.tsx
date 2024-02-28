import React, {useEffect} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../hooks/selectors";
import {logout, refreshAccessTokenAsync} from "../../features/auth/authSlice";
import {JwtTypes} from "../types/jwtTypes";
import {parseJwt} from "../constatns";


const PrivateRoute: React.FC = () => {
    const dispatch = useAppDispatch();
    const {isAuthenticated, refreshToken, error} = useAppSelector(state => state.auth);

    useEffect(() => {
        if (refreshToken) {
            const refreshTokenPayload: JwtTypes = parseJwt(refreshToken);
            if (Date.now() < refreshTokenPayload.exp * 1000) {
                dispatch(refreshAccessTokenAsync(refreshToken))
            } else {
                dispatch(logout())
            }
        }

    }, [dispatch]);

    return isAuthenticated ? <Outlet/> : <Navigate to="/"/>;
};

export default PrivateRoute;
