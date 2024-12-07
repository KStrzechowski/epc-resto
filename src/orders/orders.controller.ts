import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, GetOrderParamsDto, GetOrdersQueryDto } from './dtos';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/')
  async getOrders(@Query() query: GetOrdersQueryDto) {
    return this.ordersService.getOrders(query);
  }

  @Get('/:orderId')
  async getOrder(@Param() params: GetOrderParamsDto) {
    return this.ordersService.getOrder(params);
  }

  @Post('/')
  async createOrder(@Body() body: CreateOrderDto) {
    return this.ordersService.createOrder(body);
  }
}
