import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersDataAccessLayer } from './orders.dal';
import { MealsModule } from '@meals/meals.module';

@Module({
  imports: [MealsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersDataAccessLayer],
})
export class OrdersModule {}
