"use client";
import styles from "./video.module.scss";
import React, { useEffect, useState } from "react";
import VideoPlayer from "@/app/video/VideoPlayer";
import Header from "@/components/common/Header";
import { fetchFindVideo } from "@/services/videos/videosService";
import { videoDetails } from "@/types/videoTypes";
import { useParams } from "next/navigation";

const Container: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [videoData, setVideoData] = useState<videoDetails | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        if (uuid === undefined) return;
        const { video: videoDetail } = await fetchFindVideo(uuid);
        setVideoData(videoDetail);
      } catch (error) {
        console.error("Failed to fetch video data", error);
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
            <div>Loading...</div>
          ) : (
            <VideoPlayer
              url={`${window.location.origin}/static/videos/${videoData.hlsFilePath}`}
              poster={`${window.location.origin}/static/videos/${videoData.thumbnailPath}`}
            />
          )}
        </section>
      </main>
    </>
  );
};

export default Container;
