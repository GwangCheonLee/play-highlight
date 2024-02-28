import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import {fetchFindVideo} from "../../common/services/videos/videosService";
import {videoDetails} from "../../common/types/api/videos/videoTypes";
import styled from "styled-components";
import Header from "../../common/components/Header";


const Main = styled.main`
    padding: 0 15%;
    height: calc(100vh - 69px);
    overflow: auto;

    @media (max-width: 640px) {
        padding: 0;
    }
`;

const Section = styled.section`
    padding: 20px 0;
`;

const VideoDetail: React.FC = () => {
    const {uuid} = useParams<{ uuid: string }>();
    const [videoData, setVideoData] = useState<videoDetails | null>(null);

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                if (uuid === undefined) return
                const {video: videoDetail} = await fetchFindVideo(uuid)
                setVideoData(videoDetail);
            } catch (error) {
                console.error('Failed to fetch video data', error);
            }
        };

        if (uuid) {
            fetchVideoData();
        }
    }, [uuid]);


    return (
        <>
            <Header/>
            <Main>
                <Section>
                    {!videoData ? <div>Loading...</div> :
                        <VideoPlayer url={`${window.location.origin}/static/videos/${videoData.hlsFilePath}`}
                                     poster={`${window.location.origin}/static/videos/${videoData.thumbnailPath}`}/>}

                </Section>
            </Main>
        </>

    );
};

export default VideoDetail;
