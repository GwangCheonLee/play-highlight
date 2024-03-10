import styles from "./home.module.scss";
import Link from "next/link";
import Image from "next/image";
import { formatTimeAgo } from "@/utils/constants";

type videoCardProps = {
  videoId: string;
  src: string;
  alt: string;
  nickname: string;
  email: string;
  createdAt: Date;
  userProfileImg: string;
};
const VideoCard = ({
  videoId,
  src,
  alt,
  nickname,
  email,
  createdAt,
  userProfileImg,
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
        <div className={styles.videoUploadUserWrapper}>
          <Image
            className={styles.videoCardProfileImg}
            src={userProfileImg}
            alt="profile image"
            width={36}
            height={36}
            unoptimized={true}
          />
          <div className={styles.videoInfoWrapper}>
            <div>
              <span>{email}</span>
              <br />
              <span>
                {nickname} • {formatTimeAgo(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
