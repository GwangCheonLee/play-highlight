import React from "react";
import Container from "@/app/video/[uuid]/container";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headerList = headers();
  const referer = headerList.get("referer") || "";
  const url = new URL(referer);
  const host = headerList.get("host");
  const videoPath = `${url.protocol}//${host}/static/videos/${params.uuid}/video.mp4`;

  return {
    openGraph: {
      type: "video.other",
      url: videoPath,
      videos: [
        {
          url: videoPath,
          width: 800,
          height: 600,
          type: "video/mp4",
        },
      ],
    },
  };
}

const Page = () => {
  return <Container />;
};

export default Page;
