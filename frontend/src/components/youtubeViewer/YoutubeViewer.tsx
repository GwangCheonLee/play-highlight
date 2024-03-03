"use client";
import styles from "./youtubeViewer.module.scss";
import YouTube from "react-youtube";
import {
  youtubeViewerOnReady,
  youtubeViewerOptions,
} from "@/utils/config/youtubeViewer.config";

interface VideoViewProps {
  videoId: string;
  startTime?: number;
}

export default function YoutubeViewer({
  videoId,
  startTime = 0,
}: VideoViewProps) {
  return (
    <div className={styles.videoView}>
      <YouTube
        videoId={videoId}
        opts={youtubeViewerOptions(videoId)}
        onReady={youtubeViewerOnReady(startTime)}
      />
    </div>
  );
}
