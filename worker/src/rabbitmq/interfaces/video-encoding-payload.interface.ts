/**
 * 비디오 인코딩 메시지 인터페이스
 */
export interface VideoEncodingPayloadInterface {
  pattern: string;
  data: VideoEncodingMessageInterface;
  options: { deliveryMode: number };
}

export interface VideoEncodingMessageInterface {
  videoId: string;
}
