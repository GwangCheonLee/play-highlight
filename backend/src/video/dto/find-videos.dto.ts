import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindVideosDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  cursor?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit?: number;
}
