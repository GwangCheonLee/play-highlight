import React from 'react';
import YoutubeVideoViewer from "../../common/components/YoutubeVideoViewer";
import {styled} from "styled-components";
import {pickYoutubeVideoInformation} from "../../common/utils/youtubeConfig";
import SignInForm from "./components/SignInForm";
import SignUpLink from "./components/SignUpLink";
import {Modal} from "../../common/components/Modal";

const SignInWrapper = styled.div`
    display: flex;
    height: 100vh;

    > div:first-child {
        width: 25%
    }

    > div:last-child {
        width: 75%
    }

    @media (max-width: 640px) {
        div:first-child {
            width: 100%;
        }

        div:last-child {
            display: none;
        }
    }
`

const SignInFormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;


const SignIn = () => {
    const youtubeVideoInformation = pickYoutubeVideoInformation()
    return (
        <>
            <SignInWrapper>
                <SignInFormWrapper>
                    <SignInForm/>
                    <SignUpLink/>
                </SignInFormWrapper>
                <YoutubeVideoViewer videoId={youtubeVideoInformation.id} startTime={youtubeVideoInformation.startTime}/>
            </SignInWrapper>
            <Modal/>
        </>
    );
}

export default SignIn;
