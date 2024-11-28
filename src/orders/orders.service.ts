import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { OrdersDataAccessLayer } from './orders.dal';
import { NewOrder, NewOrderItem } from './orders.entity';
import { MealsDataAccessLayer } from '@meals/meals.dal';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersDataAccessLayer: OrdersDataAccessLayer,
    private readonly mealsDataAccessLayer: MealsDataAccessLayer,
  ) {}

  public async createOrder(orderItems: NewOrderItem[]) {
    // create order based on order items
    const totalPrice = await this.calculateTotalPrice(orderItems);
    const order: NewOrder = {
      id: uuid(),
      total_price: totalPrice,
    };

    // assign valid order id to order items
    orderItems.forEach((orderItem) => {
      orderItem.order_id = order.id;
    });

    return this.ordersDataAccessLayer.createOrder(order, orderItems);
  }

  public async getOrders(status?: string) {
    return this.ordersDataAccessLayer.getOrders(status);
  }

  public async getOrder(id: string) {
    const rows = await this.ordersDataAccessLayer.getOrder(id);

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

  private async calculateTotalPrice(orderItems: NewOrderItem[]) {
    let totalPrice = 0;

    const ids = orderItems.map((orderItem) => orderItem.meal_id);
    const meals = await this.mealsDataAccessLayer.getMealsByIds(ids);

    for (const orderItem of orderItems) {
      const meal = meals.find((meal) => meal.id === orderItem.meal_id);

      totalPrice += meal.price * orderItem.quantity;
    }

    return totalPrice;
  }
}
