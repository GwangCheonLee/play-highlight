import React from 'react';
import logo from '../assets/logo.png';
import {styled} from "styled-components";

const _LogoTitle = styled.h1`
    margin: 0;
`

const _LogoAnchor = styled.a`
    display: inline-flex;
    align-items: center;
    height: 48px;
    margin: 20px 0;
    text-decoration: none;
`

const _Img = styled.img`
    width: 24px;
    height: 24px;
    margin: 0 5px;
`

const _Span = styled.span`
    font-weight: bold;
    font-size: 16px;
    color: #cccccc;
`


function Logo() {
    return (
        <_LogoTitle>
            <_LogoAnchor href="/">
                <_Img src={logo} alt="logo image"/>
                <_Span>Play Highlight</_Span>
            </_LogoAnchor>
        </_LogoTitle>
    );
}


export default Logo;
