import React, {useEffect, useRef, useState} from 'react';
import Header from '../../common/components/Header';
import styled from 'styled-components';
import VideoCard from './components/VideoCard';
import NoVideos from './NoVideos';
import {videoDetails} from '../../common/types/api/videos/videoTypes';
import {fetchFindVideos} from "../../common/services/videos/videosService";

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

const Home = () => {
    const [videos, setVideos] = useState<videoDetails[]>([]);
    const [cursor, setCursor] = useState<number>(1);
    const [limit, setLimit] = useState<number>(25);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextCursor) {
                setCursor(prevCursor => prevCursor !== nextCursor ? nextCursor : prevCursor);
            }
        });

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.disconnect();
            }
        };
    }, [nextCursor]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const {videos: newVideos, nextCursor: newNextCursor} = await fetchFindVideos({cursor, limit});
                if (newVideos.length > 0) {
                    setVideos(prevVideos => [...prevVideos, ...newVideos]);
                    setNextCursor(newNextCursor);
                }
            } catch (error) {
                console.error('Failed to fetch videos', error);
            }
        };

        fetchVideos();
    }, [cursor, limit]);


    return (
        <>
            <Header/>
            <Main>
                <Section>
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <VideoCard
                                key={video.id}
                                videoId={video.uuid}
                                alt={`Video by ${video.user.nickname}`}
                                src={`/static/videos/${video.thumbnailPath}`}
                                nickname={video.user.nickname}
                                createdAt={new Date(video.createdAt)}
                                email={video.user.email}
                            />
                        ))
                    ) : (
                        <NoVideos/>
                    )}
                    <div ref={sentinelRef}/>
                </Section>
            </Main>
        </>
    );
};

export default Home;
