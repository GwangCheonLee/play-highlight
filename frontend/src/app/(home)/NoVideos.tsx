import styles from "./NoVideo.module.scss";
import Link from "next/link";
import { uploadPath } from "@/utils/routes/constants";

const NoVideos = () => {
  return (
    <div className={styles.noVideosWrapper}>
      <div className={styles.iconWrapper}>
        <img
          className={styles.noVideoIcon}
          alt={"empty video list"}
          src={
            "https://img.freepik.com/free-vector/never-leave-your-pet_23-2148521738.jpg?t=st=1708532594~exp=1708536194~hmac=3ca8719631d7a175d9655373f120d564be2b019db8fe19a5f25fca4a422ede1a&w=826"
          }
        />
      </div>
      <p className={styles.message}>No videos to display.</p>
      <Link className={styles.uploadButton} href={uploadPath}>
        Upload
      </Link>
    </div>
  );
};

export default NoVideos;
