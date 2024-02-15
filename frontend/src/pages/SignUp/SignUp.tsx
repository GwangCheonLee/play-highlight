import React from 'react';
import styled from "styled-components";
import {pickYoutubeVideoInformation} from "../../common/configs/youtubeVideoViewer.config";
import YoutubeVideoViewer from "../../common/components/YoutubeVideoViewer";
import SignUpForm from "./components/SignUpForm";


const SignUpContainer = styled.div`
    display: flex;
    height: 100vh;

    > div:first-child {
        width: 35%
    }

    > div:last-child {
        width: 65%
    }

    @media (max-width: 1200px) {
        div:first-child {
            width: 100%;
        }

        div:last-child {
            display: none;
        }
    }
`

const SignUpFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const SignUp = () => {
    const youtubeVideoInformation = pickYoutubeVideoInformation()
    return (
        <SignUpContainer>
            <SignUpFormContainer>
                <SignUpForm/>
            </SignUpFormContainer>
            <YoutubeVideoViewer videoId={youtubeVideoInformation.id} startTime={youtubeVideoInformation.startTime}/>
        </SignUpContainer>
    );
}

export default SignUp;
