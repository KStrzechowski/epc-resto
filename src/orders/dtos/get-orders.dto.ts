import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@orders/orders.entity';
import { PaginationDto } from '../../types';

export class GetOrdersQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status: OrderStatus | undefined;
}
