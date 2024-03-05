import React from "react";
import Container from "@/app/video/[uuid]/container";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headerList = headers();
  const currentUrl = headerList.get("referer") || "";
  const baseUrl = currentUrl.split("/video/")[0];
  const segments = currentUrl.split("video/");
  const videoUuid = segments[1];

  return {
    openGraph: {
      type: "video.other",
      url: currentUrl,
      videos: [
        {
          url: `${baseUrl}/static/videos/${videoUuid}/video.mp4`,
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
