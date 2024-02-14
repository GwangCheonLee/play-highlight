import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Root from "./pages/Root/Root";
import SignIn from "./pages/SignIn/SignIn";
import {rootPath, signInPath} from "./common/routers/path";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={rootPath} element={<Root/>}></Route>
                <Route path={signInPath} element={<SignIn/>}></Route>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
