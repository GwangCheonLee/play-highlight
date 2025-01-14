import React from 'react';
import Container from '@/app/[locale]/video/[uuid]/container';
import {Metadata, ResolvingMetadata} from 'next';
import {headers} from 'next/headers';

export async function generateMetadata(
  {params}: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headerList = headers();
  const host = headerList.get('host') || '';
  const protocol = headerList.get('x-forwarded-proto') || 'http'; // 기본 프로토콜

  // 현재 요청 URL 구성 (referer가 없는 경우를 대비)
  const currentUrl = `${protocol}://${host}/video/${params.uuid}`;

  let queryParams: Record<string, string> = {};

  try {
    const url = new URL(currentUrl); // 요청 URL에서 파라미터를 추출
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
  } catch (error) {
    console.error('Invalid URL:', currentUrl);
  }

  // 필요한 쿼리 파라미터 기본값 처리
  const userId = queryParams.userId;
  const extension = queryParams.extension || 'mp4'; // 기본 확장자

  // 동영상 경로 생성
  const videoPath = `${process.env.NEXT_PUBLIC_BUCKET_URL}/${process.env.NEXT_PUBLIC_BUCKET_NAME}/${userId}/${params.uuid}/video.${extension}`;

  return {
    openGraph: {
      type: 'video.other',
      url: videoPath,
      videos: [
        {
          url: videoPath,
          width: 800,
          height: 600,
          type: `video/${extension}`,
        },
      ],
    },
  };
}

const Page = () => {
  return <Container />;
};

export default Page;
