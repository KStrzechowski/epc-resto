import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus, OrderWithItems } from './orders.entity';
import { isEnumValue } from '../helpers';
import { ORDERS_QUEUE_NAME } from '../constants';
import { OrdersGateway } from './orders.gateway';

@Processor(ORDERS_QUEUE_NAME)
export class OrdersProcessor extends WorkerHost {
  private logger = new Logger(OrdersProcessor.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
  ) {
    super();
  }

  async process(job: Job) {
    if (!isEnumValue(OrderStatus, job.name)) {
      this.logger.warn('Incorrect order status');
      throw new Error('Bad order status');
    }

    const orderWithItems: OrderWithItems = job.data;
    const orderStatus: OrderStatus = job.name as OrderStatus;

    await this.ordersService.updateOrderStatus(orderWithItems.id, orderStatus);

    this.ordersGateway.getServer().emit(orderStatus, orderWithItems);
  }

  @OnWorkerEvent('completed')
  onJobCompleted(job: Job): void {
    this.logger.log(`Job with ID ${job.id} has been completed`);
  }

  @OnWorkerEvent('failed')
  onJobFailed(job: Job, error: Error): void {
    this.logger.error(`Job with ID ${job.id} failed: ${error.message}`);
  }
}
