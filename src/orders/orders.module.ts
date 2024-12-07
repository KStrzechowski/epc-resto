import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersDataAccessLayer } from './orders.dal';
import { MealsModule } from '@meals/meals.module';
import { OrdersGateway } from './orders.gateway';
import { OrdersProcessor } from './orders.processor';
import { ORDERS_QUEUE_NAME } from '../constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ORDERS_QUEUE_NAME,
    }),
    MealsModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersDataAccessLayer,
    OrdersProcessor,
    OrdersGateway,
  ],
})
export class OrdersModule {}
