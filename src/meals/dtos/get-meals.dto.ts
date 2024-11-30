import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../types';

export class GetMealsQueryDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly categoryId: number | undefined;
}
