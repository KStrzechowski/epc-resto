import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { NewOrderItem } from './orders.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  async createOrder(@Body() orderItems: NewOrderItem[]) {
    return this.ordersService.createOrder(orderItems);
  }

  @Get('/')
  async getOrders(@Query('status') status: string) {
    return this.ordersService.getOrders(status);
  }

  @Get('/:orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.getOrder(orderId);
  }
}
