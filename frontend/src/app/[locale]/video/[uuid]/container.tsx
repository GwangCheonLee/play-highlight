'use client';
import styles from './video.module.scss';
import React, {useEffect, useState} from 'react';
import VideoPlayer from '@/app/[locale]/video/VideoPlayer';
import Header from '@/components/common/Header';
import {fetchFindVideo} from '@/services/videos/videosService';
import {videoDetails} from '@/types/videoTypes';
import {useParams} from 'next/navigation';

const Container: React.FC = () => {
  const {uuid} = useParams<{uuid: string}>();
  const [videoData, setVideoData] = useState<videoDetails | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        if (uuid === undefined) return;
        const videoDetail: videoDetails = await fetchFindVideo(uuid);
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
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          {!videoData ? (
            <></>
          ) : (
            <VideoPlayer
              url={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${videoData.videoHlsFileLocation}`}
            />
          )}
        </section>
      </main>
    </>
  );
};

export default Container;
