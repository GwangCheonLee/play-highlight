import React from 'react';
import styled from "styled-components";
import {pickYoutubeVideoInformation} from "../../common/utils/youtubeConfig";
import YoutubeVideoViewer from "../../common/components/YoutubeVideoViewer";
import SignUpForm from "./components/SignUpForm";
import {Modal} from "../../common/components/Modal";


const SignUpWrapper = styled.div`
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
        <>
            <SignUpWrapper>
                <SignUpFormWrapper>
                    <SignUpForm/>
                </SignUpFormWrapper>
                <YoutubeVideoViewer videoId={youtubeVideoInformation.id} startTime={youtubeVideoInformation.startTime}/>
            </SignUpWrapper>
            <Modal/>
        </>
    );
}

export default SignUp;
