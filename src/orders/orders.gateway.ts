import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { OrderStatus, OrderWithItems } from './orders.entity';
import { OrdersService } from './orders.service';
import { ORDERS_QUEUE_NAME } from '../constants';

@Injectable()
@WebSocketGateway({ namespace: 'websocket' })
export class OrdersGateway {
  @WebSocketServer() server!: Server;
  private logger = new Logger(OrdersGateway.name);

  constructor(
    @InjectQueue(ORDERS_QUEUE_NAME) private readonly ordersQueue: Queue,
    private ordersService: OrdersService,
  ) {}

  public getServer() {
    return this.server;
  }

  @SubscribeMessage(OrderStatus.NEW)
  async handleExitNewEvent(
    @MessageBody() orderId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const order = await this.ordersService.getOrder({ orderId });

    if (this.validateOrderStatus(client, order, OrderStatus.NEW)) {
      this.ordersQueue.add(OrderStatus.IN_THE_KITCHEN, order);
    }
  }

  @SubscribeMessage(OrderStatus.IN_THE_KITCHEN)
  async handleExitKitchenEvent(
    @MessageBody() orderId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const order = await this.ordersService.getOrder({ orderId });

    if (this.validateOrderStatus(client, order, OrderStatus.IN_THE_KITCHEN)) {
      this.ordersQueue.add(OrderStatus.IN_DELIVERY, order);
    }
  }

  @SubscribeMessage(OrderStatus.IN_DELIVERY)
  async handleExitDeliveryEvent(
    @MessageBody() orderId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const order = await this.ordersService.getOrder({ orderId });

    if (this.validateOrderStatus(client, order, OrderStatus.IN_DELIVERY)) {
      this.ordersQueue.add(OrderStatus.DONE, order);
    }
  }

  private validateOrderStatus(
    client: Socket,
    order: OrderWithItems,
    orderStatus: OrderStatus,
  ) {
    if (!order) {
      this.logger.warn(`Order not found`);
      client.emit('statusError', `Order not found`);
      return false;
    }

    if (order.status !== orderStatus) {
      this.logger.warn(`Incorrect order status`);
      client.emit(
        'statusError',
        `Order with id "${order.id}" has status "${order.status}"`,
      );
      return false;
    }

    return true;
  }
}
