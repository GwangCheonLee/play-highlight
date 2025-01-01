import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeNicknameRequestBodyDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
