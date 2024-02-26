import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    url: string;
    poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({url, poster}) => {
    return (
        <div className='player-wrapper'>
            <ReactPlayer
                url={url}
                className='react-player'
                playing={true} // 비디오를 자동으로 재생
                controls={true} // 재생 컨트롤을 표시
                light={false} // 프리뷰 모드를 비활성화
                width='100%'
                height='100%'
            />
        </div>
    );
};

export default VideoPlayer;
