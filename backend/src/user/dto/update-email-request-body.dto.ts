import { IsEmail, IsNotEmpty } from 'class-validator';

/*
 * UpdateEmailRequestBodyDto 는 이메일 변경 요청 시 클라이언트에서 전달되는 데이터를 검증하는 DTO 클래스입니다.
 */
export class UpdateEmailRequestBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
