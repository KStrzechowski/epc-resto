import { Meal } from '@meals/meals.entity';

export interface NewOrder {
  id: string;
  total_price: number;
}

export interface NewOrderItem {
  order_id: string;
  meal_id: number;
  quantity: number;
}

export interface Order {
  id: string;
  total_price: number;
  status: OrderStatus;
}

export interface OrderItem {
  id: number;
  order: Order;
  meal: Meal;
  quantity: number;
}

export enum OrderStatus {
  NEW = 'new',
  IN_THE_KITCHEN = 'in_the_kitchen',
  IN_DELIVERY = 'in_delivery',
  DONE = 'done',
}
