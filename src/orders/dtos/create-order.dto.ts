import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems!: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  @IsInt()
  @IsPositive()
  mealId!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}
