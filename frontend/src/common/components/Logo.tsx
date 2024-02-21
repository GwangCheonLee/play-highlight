import React from 'react';
import logo from '../assets/images/logo.png';
import styled from "styled-components";
import {Link} from "react-router-dom";

const LogoTitle = styled.h1`
    margin: 0;
`;

const LogoLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    height: 48px;
    text-decoration: none;

    &.no-pointer-events {
        pointer-events: none;
    }
`;

const Img = styled.img`
    width: 24px;
    height: 24px;
    margin-right: 5px;
`;

const Span = styled.span`
    font-weight: bold;
    font-size: 16px;
    color: #000000;
`;

export const Logo = ({className, isPointerEvent = false}: { className?: string, isPointerEvent?: boolean }) => {
    return (
        <LogoTitle className={className}>
            <LogoLink to="/" className={!isPointerEvent ? 'no-pointer-events' : ''}>
                <Img src={logo} alt="logo image"/>
                <Span>Play Highlight</Span>
            </LogoLink>
        </LogoTitle>
    );
}


export const SignPageLogo = styled(Logo)`
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-right: 20px;

    img {
        width: 36px;
        height: 36px;
        margin: 0 10px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    span {
        font-weight: bold;
        font-size: 24px;
        color: #000000;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
`;