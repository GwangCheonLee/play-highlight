import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {signInPath} from "../routers/path";

const RequireAuth = () => {
    const {isAuthenticated} = useAuth();
    const location = useLocation();
    
    if (!isAuthenticated) {
        return <Navigate to={signInPath} state={{from: location}} replace/>;
    }
    
    return <Outlet/>;
};


export default RequireAuth