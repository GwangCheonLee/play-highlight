import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const SignUpDescription = styled.p`
    font-size: 12px;
`;

const SignUpLink = styled(Link)`
    color: #4164e3;
    cursor: pointer;
    text-decoration: none;
`;

const SignUpLinkContainer = () => {
    return (
        <SignUpDescription>
            Don't have an account? <SignUpLink to="/sign-up">Sign up</SignUpLink>
        </SignUpDescription>
    );
}

export default SignUpLinkContainer