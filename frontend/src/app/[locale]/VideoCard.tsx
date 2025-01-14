'use client';
import styles from './home.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import {useTranslations} from 'next-intl';

type videoCardProps = {
  videoId: string;
  src: string;
  alt: string;
  nickname: string;
  email: string;
  createdAt: Date;
  userProfileImg: string;
  userId: string;
  extension: string;
};
const VideoCard = ({
                     videoId,
                     src,
                     alt,
                     nickname,
                     email,
                     createdAt,
                     userProfileImg,
                     userId,
                     extension,
                   }: videoCardProps) => {
  const t = useTranslations('Video');

  const formatTimeAgo = (createdAt: Date): string => {
    const now = new Date();
    const diffInSeconds = (now.getTime() - createdAt.getTime()) / 1000;

    if (diffInSeconds < 60) {
      return t('justNow');
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return t('minutesAgo', {count: diffInMinutes});
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('hoursAgo', {count: diffInHours});
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return t('daysAgo', {count: diffInDays});
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInDays < 365) {
      return t('monthsAgo', {count: diffInMonths});
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return t('yearsAgo', {count: diffInYears});
  };

  return (
    <Link className={styles.videoCardLink} href={`video/${videoId}?userId=${userId}&extension=${extension}`}>
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
