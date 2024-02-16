import styled from "styled-components";
import {Link} from "react-router-dom";
import {formatTimeAgo} from "../../../common/commom.constant";

const VideoCardLink = styled(Link)`
    width: calc((100% / 5));
    height: fit-content;
    padding: 4px;
    box-sizing: border-box;
    text-decoration: none;
    border-radius: 6px;

    &:active {
        background-color: #e5e5e5;
    }

    img {
        border-radius: 16px;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media (max-width: 1250px) {
        width: calc((100% / 4));
    }

    @media (max-width: 1024px) {
        width: calc((100% / 3));
    }

    @media (max-width: 768px) {
        width: calc((100% / 2));
    }

    @media (max-width: 480px) {
        width: calc((100% / 1));
    }
`

const VideoDescriptionWrapper = styled.div`
    padding: 2%;
    font-size: 12px;
    color: #606060;
`
type videoCardProps = { videoId: string, src: string, alt: string, nickname: string, email: string, createdAt: Date }


const VideoCard = ({videoId, src, alt, nickname, email, createdAt}: videoCardProps) => {
    return (
        <VideoCardLink to={`video/${videoId}`}>
            <img
                draggable="false"
                src={src}
                alt={alt}/>
            <VideoDescriptionWrapper>
                <span>{email}</span>
                <br/>
                <span>{nickname}</span>
                {' '}<span>•</span>{' '}
                <span>{formatTimeAgo(createdAt)}</span>
            </VideoDescriptionWrapper>
        </VideoCardLink>
    )
}

export default VideoCard