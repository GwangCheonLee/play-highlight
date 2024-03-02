import Link from "next/link";
import styles from "./logo.module.css";
import Image from "next/image";

export default function Logo() {
  return (
    <h1 className={styles.title}>
      <Link className={styles.link} href={""}>
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
