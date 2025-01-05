/**
 * 비디오 업로드 상태
 */
export enum VideoUploadStatus {
  ORIGINAL_UPLOADED = 'ORIGINAL_UPLOADED', // 원본 업로드 완료
  THUMBNAIL_GENERATED = 'THUMBNAIL_GENERATED', // 썸네일 생성 완료
  HLS_ENCODING_COMPLETED = 'HLS_ENCODING_COMPLETED', // HLS 인코딩 완료
}
