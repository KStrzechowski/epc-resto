import { Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  createOrder() {
    // create a new order
  }

  @Get('/')
  getOrders() {
    // return all orders with status
  }

  @Get('/:orderId')
  getOrder() {
    // return order details
  }
}
