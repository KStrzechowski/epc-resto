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
  status: OrderStatus;
  total_price: number;
}

export interface OrderItem {
  meal_name: string;
  price: number;
  quantity: number;
}

export interface OrderWithItems {
  id: string;
  status: OrderStatus;
  total_price: number;
  order_items: OrderItem[];
}

export enum OrderStatus {
  NEW = 'new',
  IN_THE_KITCHEN = 'in_the_kitchen',
  IN_DELIVERY = 'in_delivery',
  DONE = 'done',
}
