import { IsOptional, IsString } from 'class-validator';

/*
 * UploadVideoRequestBodyDto 는 비디오 업로드시 요청 바디의 데이터를 검증하기 위한 DTO 클래스이다.
 */
export class UploadVideoRequestBodyDto {
  @IsString()
  @IsOptional()
  title?: string | null;
}
