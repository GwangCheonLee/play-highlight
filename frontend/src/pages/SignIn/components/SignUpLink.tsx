import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {signUpPath} from "../../../common/routers/path";

const SignUpDescription = styled.p`
    font-size: 12px;
`;

const SignUpHyperLink = styled(Link)`
    color: #4164e3;
    cursor: pointer;
    text-decoration: none;
`;

const SignUpLink = () => {
    return (
        <SignUpDescription>
            Don't have an account? <SignUpHyperLink to={signUpPath}>Sign up</SignUpHyperLink>
        </SignUpDescription>
    );
}

export default SignUpLink