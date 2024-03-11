import React from "react";
import Container from "@/app/[locale]/video/[uuid]/container";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headerList = headers();
  const xForwardedProto = headerList.get("x-forwarded-proto") || "";
  const host = headerList.get("host");
  const videoPath = `${xForwardedProto}//${host}/static/videos/${params.uuid}/video.mp4`;

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
