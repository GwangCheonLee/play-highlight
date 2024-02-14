import React from 'react';
import YoutubeVideoViewer from "../../common/components/YoutubeVideoViewer";
import {styled} from "styled-components";
import {pickYoutubeVideoInformation} from "../../common/configs/youtubeVideoViewer.config";
import SignInForm from "./components/SignInForm";
import SignUpLinkContainer from "./components/SiginUpLinkContainer";


const SignInContainer = styled.div`
    display: flex;
    height: 100vh;

    > div:first-child {
        width: 35%
    }

    > div:last-child {
        width: 65%
    }
`

const SignInFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;


const SignIn = () => {
    const youtubeVideoInformation = pickYoutubeVideoInformation()
    return (
        <SignInContainer>
            <SignInFormContainer>
                <SignInForm/>
                <SignUpLinkContainer/>
            </SignInFormContainer>
            <YoutubeVideoViewer videoId={youtubeVideoInformation.id} startTime={youtubeVideoInformation.startTime}/>
        </SignInContainer>
    );
}

export default SignIn;
