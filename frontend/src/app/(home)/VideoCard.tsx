import styles from "./home.module.scss";
import { formatTimeAgo } from "@/utils/constants";
import Link from "next/link";
import Image from "next/image";

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
      <Image
        draggable="false"
        src={src}
        alt={alt}
        width={100}
        height={100}
        unoptimized={true}
      />
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
