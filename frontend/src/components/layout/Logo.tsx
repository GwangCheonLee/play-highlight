import Link from "next/link";
import styles from "./logo.module.scss";
import Image from "next/image";
import { rootPath } from "@/common/routes/constants";

export default function Logo() {
  return (
    <h1 className={styles.title}>
      <Link className={styles.link} href={rootPath}>
        <Image
          className={styles.img}
          src={"/assets/images/logo.png"}
          alt="logo image"
          width={100}
          height={100}
        />
        <span className={styles.span}>Play Highlight</span>
      </Link>
    </h1>
  );
}
