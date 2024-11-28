import { Meal } from '@meals/meals.entity';
import { OrderStatus } from '../types';

export interface NewOrder {
  id: string;
  total_price: number;
}

export interface Order {
  id: string;
  total_price: number;
  status: OrderStatus;
}

export interface NewOrderItem {
  order_id?: string;
  meal_id: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  order: Order;
  meal: Meal;
  quantity: number;
}
