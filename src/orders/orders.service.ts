import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  NewOrder,
  NewOrderItem,
  Order,
  OrderStatus,
  OrderWithItems,
} from './orders.entity';
import { OrdersDataAccessLayer } from './orders.dal';
import { MealsDataAccessLayer } from '../meals/meals.dal';
import { GetOrdersQueryDto } from './dtos/get-orders.dto';
import { CreateOrderDto, CreateOrderItemDto, GetOrderParamsDto } from './dtos';

@Injectable()
export class OrdersService {
  constructor(
    @InjectQueue('orders') private readonly ordersQueue: Queue,
    private readonly ordersDataAccessLayer: OrdersDataAccessLayer,
    private readonly mealsDataAccessLayer: MealsDataAccessLayer,
  ) {}

  public async getOrders(query: GetOrdersQueryDto): Promise<Order[]> {
    const { status } = query;

    return this.ordersDataAccessLayer.getOrders(status);
  }

  public async getOrder(params: GetOrderParamsDto): Promise<OrderWithItems> {
    const { orderId } = params;

    const rows = await this.ordersDataAccessLayer.getOrder(orderId);

    const orderItems = rows.map((row) => ({
      quantity: row.quantity,
      price: row.price,
      meal_name: row.meal_name,
    }));

    return {
      id: rows[0].id,
      status: rows[0].status,
      total_price: rows[0].total_price,
      order_items: orderItems,
    };
  }

  public async createOrder(body: CreateOrderDto): Promise<OrderWithItems> {
    const { orderItems } = body;

    const totalPrice = await this.calculateTotalPrice(orderItems);

    // create order
    const order: NewOrder = {
      id: uuid(),
      total_price: totalPrice,
    };

    // create order items with valid order id to
    const newOrderItems: NewOrderItem[] = orderItems.map((orderItem) => ({
      order_id: order.id,
      meal_id: orderItem.mealId,
      quantity: orderItem.quantity,
    }));

    // save order and order items in database
    await this.ordersDataAccessLayer.createOrder(order, newOrderItems);

    const orderWithItems: OrderWithItems = await this.getOrder({
      orderId: order.id,
    });

    await this.ordersQueue.add(orderWithItems.status, orderWithItems);

    return orderWithItems;
  }

  public async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    return this.ordersDataAccessLayer.updateOrderStatus(orderId, status);
  }

  public async calculateTotalPrice(orderItems: CreateOrderItemDto[]) {
    let totalPrice = 0;

    const ids = orderItems.map((orderItem) => orderItem.mealId);
    const meals = await this.mealsDataAccessLayer.getMealsByIds(ids);

    for (const orderItem of orderItems) {
      const meal = meals.find((meal) => meal.id === orderItem.mealId);

      totalPrice += Math.round(meal.price * orderItem.quantity * 100) / 100;
    }

    return totalPrice;
  }
}
