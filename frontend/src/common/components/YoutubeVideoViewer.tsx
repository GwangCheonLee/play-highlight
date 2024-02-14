import React from "react";
import {styled} from "styled-components";
import YouTube from "react-youtube";
import {youtubeViewerOnReady, youtubeViewerOptions} from "../configs/youtubeVideoViewer.config";

const _VideoView = styled.div`
    position: relative;
    overflow: hidden;
    pointer-events: none;
    width: 100%;
    height: 100%;

    > div {
        height: 100%;
    }

    iframe {
        border: 0;
        margin-left: -100%;
        width: 300%;
        height: 100%;
    }
`

interface VideoViewProps {
    videoId: string;
    startTime?: number;
}

function YoutubeVideoViewer({videoId, startTime = 0}: VideoViewProps) {
    return (
        <_VideoView>
            <YouTube
                videoId={videoId}
                opts={youtubeViewerOptions(videoId)}
                onReady={youtubeViewerOnReady(startTime)}
            />
        </_VideoView>
    );
}


export default YoutubeVideoViewer;
