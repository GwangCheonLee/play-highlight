import { YouTubeEvent } from "react-youtube";

interface youtubeVideoInformationInterface {
  id: string;
  startTime: number;
  description: string;
}

const youtubeVideoInformation: youtubeVideoInformationInterface[] = [
  { id: "ThI_ywSSsIQ", startTime: 0, description: "league of legends" },
  { id: "JHcDUSeWN3Q", startTime: 0, description: "league of legends" },
  { id: "4DuSbbK_aKE", startTime: 0, description: "league of legends" },
  { id: "QdLyhBUIbts", startTime: 0, description: "league of legends" },
  { id: "j9YXi0WohA4", startTime: 0, description: "Overwatch2" },
];
export const pickYoutubeVideoInformation =
  (): youtubeVideoInformationInterface => {
    const randomNumber = Math.floor(
      Math.random() * youtubeVideoInformation.length,
    );
    return youtubeVideoInformation[randomNumber];
  };

export const youtubeViewerOptions = (videoId: string) => ({
  playerVars: {
    cc_load_policy: 0,
    playsinline: 1,
    autoplay: 1,
    rel: 0,
    modestbranding: 1,
    controls: 0,
    iv_load_policy: 3,
    listType: "playlist",
    disablekb: 1,
    playlist: videoId,
    loop: 1,
  },
});

export const youtubeViewerOnReady =
  (startTime: number) => (event: YouTubeEvent) => {
    event.target.seekTo(startTime);
    event.target.mute();
    event.target.playVideo();
  };
