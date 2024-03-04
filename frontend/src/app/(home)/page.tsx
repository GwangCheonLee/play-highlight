import Header from "@/components/common/Header";
import React from "react";
import styles from "./home.module.scss";
import VideoCard from "@/app/(home)/VideoCard";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          {/*<NoVideos />*/}
          <VideoCard
            videoId={""}
            src={
              "https://i.ytimg.com/vi/ikN8HeyvbcI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDn5ZoXHskhjsJ1FaJP48-3EOJROA"
            }
            alt={""}
            nickname={"as"}
            email={"asd"}
            createdAt={new Date()}
          />
        </section>
      </main>
    </>
  );
}
