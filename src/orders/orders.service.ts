import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { OrdersDataAccessLayer } from './orders.dal';
import { NewOrder, NewOrderItem } from './orders.entity';
import { MealsDataAccessLayer } from '@meals/meals.dal';
import { GetOrdersQueryDto } from './dtos/get-orders.dto';
import { CreateOrderDto, CreateOrderItemDto, GetOrderParamsDto } from './dtos';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersDataAccessLayer: OrdersDataAccessLayer,
    private readonly mealsDataAccessLayer: MealsDataAccessLayer,
  ) {}

  public async createOrder(body: CreateOrderDto) {
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
    return this.ordersDataAccessLayer.createOrder(order, newOrderItems);
  }

  public async getOrders(query: GetOrdersQueryDto) {
    const { status } = query;

    return this.ordersDataAccessLayer.getOrders(status);
  }

  public async getOrder(params: GetOrderParamsDto) {
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
      orderItems,
    };
  }

  private async calculateTotalPrice(orderItems: CreateOrderItemDto[]) {
    let totalPrice = 0;

    const ids = orderItems.map((orderItem) => orderItem.mealId);
    const meals = await this.mealsDataAccessLayer.getMealsByIds(ids);

    for (const orderItem of orderItems) {
      const meal = meals.find((meal) => meal.id === orderItem.mealId);

      totalPrice += meal.price * orderItem.quantity;
    }

    return totalPrice;
  }
}
