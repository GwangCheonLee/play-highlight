import React from 'react';
import styled from "styled-components";
import {pickYoutubeVideoInformation} from "../../common/configs/youtubeVideoViewer.config";
import YoutubeVideoViewer from "../../common/components/YoutubeVideoViewer";
import SignUpForm from "./components/SignUpForm";


const SignUpWrapper = styled.div`
    display: flex;
    height: 100vh;

    > div:first-child {
        width: 35%
    }

    > div:last-child {
        width: 65%
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

const SignUpFormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const SignUp = () => {
    const youtubeVideoInformation = pickYoutubeVideoInformation()
    return (
        <SignUpWrapper>
            <SignUpFormWrapper>
                <SignUpForm/>
            </SignUpFormWrapper>
            <YoutubeVideoViewer videoId={youtubeVideoInformation.id} startTime={youtubeVideoInformation.startTime}/>
        </SignUpWrapper>
    );
}

export default SignUp;
