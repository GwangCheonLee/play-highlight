import Header from "@/components/common/Header";
import React from "react";
import styles from "./home.module.scss";
import NoVideos from "@/app/(home)/NoVideos";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <NoVideos />
        </section>
      </main>
    </>
  );
}
