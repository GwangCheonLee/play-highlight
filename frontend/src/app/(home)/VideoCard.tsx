import styles from "./home.module.scss";
import { formatTimeAgo } from "@/utils/constants";
import Link from "next/link";

type videoCardProps = {
  videoId: string;
  src: string;
  alt: string;
  nickname: string;
  email: string;
  createdAt: Date;
};
const VideoCard = ({
  videoId,
  src,
  alt,
  nickname,
  email,
  createdAt,
}: videoCardProps) => {
  return (
    <Link className={styles.videoCardLink} href={`video/${videoId}`}>
      <img draggable="false" src={src} alt={alt} />
      <div className={styles.videoDescriptionWrapper}>
        <span>{email}</span>
        <br />
        <span>{nickname}</span> <span>•</span>{" "}
        <span>{formatTimeAgo(createdAt)}</span>
      </div>
    </Link>
  );
};

export default VideoCard;
