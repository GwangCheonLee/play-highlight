import React from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";
import {uploadPath} from "../../common/routers/path";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const Message = styled.p`
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
`;

const UploadButton = styled(Link)`
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    background-color: #4169e1;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    text-decoration: none;

    &:hover {
        background-color: #3651b0;
    }
`;

const IconWrapper = styled.div`
    width: 50%;
    height: 50%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`

const NoVideosIcon = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const NoVideos = () => {
    return (
        <Container>
            <IconWrapper>
                <NoVideosIcon
                    src={'https://img.freepik.com/free-vector/never-leave-your-pet_23-2148521738.jpg?t=st=1708532594~exp=1708536194~hmac=3ca8719631d7a175d9655373f120d564be2b019db8fe19a5f25fca4a422ede1a&w=826'}/>
            </IconWrapper>
            <Message>No videos to display.</Message>
            <UploadButton to={uploadPath}>Upload</UploadButton>
        </Container>
    );
};

export default NoVideos;
