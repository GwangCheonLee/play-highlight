import styles from './NoVideo.module.scss';
import Link from 'next/link';
import {uploadPath} from '@/utils/routes/constants';
import Image from 'next/image';
import {useTranslations} from 'next-intl';

const NoVideos = () => {
  const t = useTranslations('Video');

  return (
    <div className={styles.noVideosWrapper}>
      <div className={styles.iconWrapper}>
        <Image
          width={100}
          height={100}
          className={styles.noVideoIcon}
          alt={'empty video list'}
          src={'/assets/images/no_video.avif'}
          unoptimized={true}
        />
      </div>
      <p className={styles.message}>{t('noVideo')}</p>
      <Link className={styles.uploadButton} href={uploadPath}>
        {t('uploadButton')}
      </Link>
    </div>
  );
};

export default NoVideos;
