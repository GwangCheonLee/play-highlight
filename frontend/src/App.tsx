import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import {rootPath, signInPath, signUpPath} from "./common/routers/path";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={rootPath} element={<Home/>}/>
                <Route path={signUpPath} element={<SignUp/>}></Route>
                <Route path={signInPath} element={<SignIn/>}></Route>
                <Route path="*" element={<Navigate to={rootPath} replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
