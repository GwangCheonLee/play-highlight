import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, poster }) => {
  return (
    <div className="player-wrapper">
      <ReactPlayer
        url={url}
        className="react-player"
        playing={true}
        controls={true}
        light={false}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default VideoPlayer;
