import { IsUUID } from 'class-validator';

export class GetOrderParamsDto {
  @IsUUID(4)
  orderId!: string;
}
