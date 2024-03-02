"use client";
import styles from "./youtube-viewer.module.css";
import YouTube from "react-youtube";
import {
  youtubeViewerOnReady,
  youtubeViewerOptions,
} from "@/common/config/youtube-viewer.config";

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
