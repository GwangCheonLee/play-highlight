import React, {useEffect, useRef} from 'react';
import Header from '../../common/components/Header';
import styled from 'styled-components';
import {useAppDispatch, useAppSelector} from "../../common/hooks/selectors";
import {fetchVideos} from "../../features/video/videoSlice";
import VideoCard from "./components/VideoCard";
import NoVideos from "./NoVideos";

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
    const dispatch = useAppDispatch();
    const {videos, nextCursor, status} = useAppSelector(state => state.video);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (videos.length <= 0) {
            dispatch(fetchVideos({cursor: null, limit: 25}));
        }
    }, [dispatch]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextCursor !== null) {
                dispatch(fetchVideos({cursor: nextCursor, limit: 25}));
            }
        });

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => observer.disconnect();
    }, [dispatch, nextCursor]);

    return (
        <>
            <Header/>
            <Main>
                <Section>
                    {(videos.length > 0 ? (
                        videos.map(video => (
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
                        status !== 'loading' && <NoVideos/>
                    ))}
                    {status === 'loading' && <p>Loading...</p>}
                    <div ref={sentinelRef}/>
                </Section>
            </Main>
        </>
    );
};

export default Home;