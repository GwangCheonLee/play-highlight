import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindVideosDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  cursor?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit?: number;
}
