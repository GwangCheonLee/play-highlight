import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Provider} from 'react-redux';
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import {rootPath, signInPath, signUpPath, uploadPath} from "./common/routers/path";
import {index} from "./store";
import Upload from "./pages/Upload/Upload";
import PrivateRoute from "./common/components/PrivateRoute";


function App() {
    return (
        <Provider store={index}>
            <BrowserRouter>
                <Routes>
                    <Route path={rootPath} element={<Home/>}/>
                    <Route path={signUpPath} element={<SignUp/>}></Route>
                    <Route path={signInPath} element={<SignIn/>}></Route>
                    <Route element={<PrivateRoute/>}>
                        <Route path={uploadPath} element={<Upload/>}></Route>
                    </Route>
                    <Route path="*" element={<Navigate to={rootPath} replace/>}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
