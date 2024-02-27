import React, {ChangeEvent, DragEvent, useState} from 'react';
import styled from 'styled-components';
import Header from "../../common/components/Header";
import {useAppDispatch} from "../../common/hooks/selectors";
import {showModal} from "../../features/modal/modalSlice";
import {Modal} from "../../common/components/Modal";
import {fetchUploadVideos} from "../../common/services/videos/videosService";

const Main = styled.main`
    padding: 0 15%;
    height: calc(100vh - 69px);
    overflow: auto;

    @media (max-width: 640px) {
        padding: 0;
    }
`;

const Section = styled.section`
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    padding: 20px 0;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;


const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 400px;
    border: 2px dashed #ccc;
    border-radius: 20px;
    margin-top: 50px;
    cursor: pointer;
`;

const UploadInput = styled.input`
    display: none;
`;

const ActionContainer = styled.div`
    margin-top: 20px;
`;

const FileDetails = styled.div`
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    margin-right: 10px;

    &:last-child {
        margin-right: 0;
    }
`;

const LoadingOverlay = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 10;
`;

const Spinner = styled.div`
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s ease infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const Upload: React.FC = () => {
    const dispatch = useAppDispatch();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            const file = files[0];
            if (file.type.startsWith('video/')) {
                setSelectedFile(file);
            } else {
                dispatch(showModal({message: 'Only video files can be uploaded.'}));
            }
        }
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const uploadFile = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("video", selectedFile);

        try {
            await fetchUploadVideos(formData);
            dispatch(showModal({message: 'File upload successful!'}));
        } catch (error) {
            console.error('File upload failed', error);
            dispatch(showModal({message: 'File upload failed'}));
        } finally {
            setIsLoading(false);
        }
    };

    const renderFileInfo = () => {
        if (!selectedFile) {
            return <p>Drag and drop a file here or click the button to select a file.</p>;
        }

        return (
            <FileDetails>
                <p>File name: {selectedFile.name}</p>
                <p>File size: {selectedFile.size} bytes</p>
                <p>File type: {selectedFile.type}</p>
            </FileDetails>
        );
    };

    return (
        <>
            <Header/>
            <Main>
                <Section>
                    {isLoading && ( // 로딩 상태가 true일 때 로딩 인디케이터 표시
                        <LoadingOverlay>
                            <Spinner/>
                        </LoadingOverlay>
                    )}
                    <Container onDragOver={onDragOver} onDrop={onDrop}>
                        {renderFileInfo()}
                        <ActionContainer>
                            <Button onClick={() => document.getElementById('file-upload')?.click()}>
                                Select File
                            </Button>
                            <Button onClick={uploadFile}>
                                Upload
                            </Button>
                            <UploadInput id="file-upload" type="file" accept="video/*" onChange={onChange}/>
                        </ActionContainer>
                    </Container>
                </Section>
            </Main>
            <Modal/>
        </>
    );
};

export default Upload;
