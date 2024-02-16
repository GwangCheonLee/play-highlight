import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

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
            Don't have an account? <SignUpHyperLink to="/sign-up">Sign up</SignUpHyperLink>
        </SignUpDescription>
    );
}

export default SignUpLink