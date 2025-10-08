import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  lastId?: number = 0;

  @IsNumber()
  @Min(1, { message: 'Take must be at least 1' })
  @Max(100, { message: 'Take must be less than 100' })
  @Type(() => Number)
  take: number;
}
