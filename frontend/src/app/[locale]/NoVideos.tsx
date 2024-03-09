import styles from "./NoVideo.module.scss";
import Link from "next/link";
import { uploadPath } from "@/utils/routes/constants";
import Image from "next/image";
import { useTranslations } from "next-intl";

const NoVideos = () => {
  const t = useTranslations("Video");

  return (
    <div className={styles.noVideosWrapper}>
      <div className={styles.iconWrapper}>
        <Image
          width={100}
          height={100}
          className={styles.noVideoIcon}
          alt={"empty video list"}
          src={
            "https://img.freepik.com/free-vector/never-leave-your-pet_23-2148521738.jpg?t=st=1708532594~exp=1708536194~hmac=3ca8719631d7a175d9655373f120d564be2b019db8fe19a5f25fca4a422ede1a&w=826"
          }
          unoptimized={true}
        />
      </div>
      <p className={styles.message}>{t("noVideo")}</p>
      <Link className={styles.uploadButton} href={uploadPath}>
        {t("uploadButton")}
      </Link>
    </div>
  );
};

export default NoVideos;
