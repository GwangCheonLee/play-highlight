import React from 'react';
import logo from '../assets/logo.png';
import styled from "styled-components";
import {Link} from "react-router-dom";

const _LogoTitle = styled.h1`
    margin: 0;
`;

const _LogoAnchor = styled(Link)<{ isPointerEvent: boolean }>`
    display: inline-flex;
    align-items: center;
    height: 48px;
    text-decoration: none;
    pointer-events: ${({isPointerEvent}) => (isPointerEvent ? `auto` : 'none')};
`;

const _Img = styled.img`
    width: 24px;
    height: 24px;
    margin: 0 5px;
`;

const _Span = styled.span`
    font-weight: bold;
    font-size: 16px;
    color: #000000;
`;

function Logo({className}: { className?: string }) {
    return (
        <_LogoTitle className={className}>
            <_LogoAnchor to="/" isPointerEvent={false}>
                <_Img src={logo} alt="logo image"/>
                <_Span>Play Highlight</_Span>
            </_LogoAnchor>
        </_LogoTitle>
    );
}

export default Logo;
