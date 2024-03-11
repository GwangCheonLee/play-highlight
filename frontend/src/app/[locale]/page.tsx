"use client";
import Header from "@/components/common/Header";
import styles from "./home.module.scss";
import VideoCard from "@/app/[locale]/VideoCard";
import React, { useCallback, useEffect, useRef, useState } from "react";
import NoVideos from "@/app/[locale]/NoVideos";
import { videoDetails } from "@/types/videoTypes";
import { fetchFindVideos } from "@/services/videos/videosService";

export default function Home() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [videos, setVideos] = useState<videoDetails[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(0);

  const findVideos = useCallback(async () => {
    const response = await fetchFindVideos({ cursor: nextCursor, limit: 25 });
    setNextCursor(response.nextCursor);
    setVideos((currentVideos) => {
      const newVideos = response.videos.filter(
        (newVideo) =>
          !currentVideos.some(
            (currentVideo) => currentVideo.id === newVideo.id,
          ),
      );
      return [...currentVideos, ...newVideos];
    });
  }, [nextCursor]);

  useEffect(() => {
    if (videos.length <= 0 && nextCursor !== null) {
      findVideos();
    }
  }, [findVideos, videos, nextCursor]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextCursor !== null) {
        findVideos();
      }
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [findVideos, videos, nextCursor]);

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          {videos.length > 0 ? (
            videos.map((video) => {
              const userProfileImage = video.user.profileImage
                ? `/static/profiles/${video.user.id}/${video.user.profileImage}`
                : "/assets/images/default_user_profile.png";
              return (
                <VideoCard
                  key={video.id}
                  videoId={video.uuid}
                  alt={`Video by ${video.user.nickname}`}
                  src={`/static/videos/${video.uuid}/${video.thumbnailFileName}`}
                  nickname={video.user.nickname}
                  createdAt={new Date(video.createdAt)}
                  email={video.user.email}
                  userProfileImg={userProfileImage}
                />
              );
            })
          ) : (
            <NoVideos />
          )}
          <div ref={sentinelRef} />
        </section>
      </main>
    </div>
  );
}
