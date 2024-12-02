import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';
import { OrdersService } from '../orders/orders.service';
import { OrdersDataAccessLayer } from '../orders/orders.dal';
import { MealsDataAccessLayer } from '../meals/meals.dal';
import { OrderStatus } from '../orders/orders.entity';
import { GetOrderParamsDto, GetOrdersQueryDto } from '../orders/dtos';

describe('OrdersService', () => {
  const mockOrdersDAL = {
    getOrders: jest.fn(),
    getOrder: jest.fn(),
  };
  const mockMealsDAL = {
    getMealsByIds: jest.fn(),
  };

  const mockQueue = {};

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  const createTestingModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersDataAccessLayer, useValue: mockOrdersDAL },
        { provide: MealsDataAccessLayer, useValue: mockMealsDAL },
        { provide: 'BullQueue_orders', useValue: mockQueue },
      ],
    }).compile();
    return module.get<OrdersService>(OrdersService);
  };

  describe('getOrders', () => {
    it('should call getOrders method from OrdersDataAccessLayer once', async () => {
      const ordersService = await createTestingModule();

      ordersService.getOrders({
        status: undefined,
      });

      expect(mockOrdersDAL.getOrders).toHaveBeenCalledTimes(1);
    });

    it('should call getOrders with valid status and return list of orders', async () => {
      const ordersService = await createTestingModule();

      const query: GetOrdersQueryDto = { status: OrderStatus.IN_DELIVERY };
      const mockOrders = [
        { id: '3', status: OrderStatus.IN_DELIVERY, total_price: 20 },
        { id: '4', status: OrderStatus.IN_DELIVERY, total_price: 25 },
      ];

      mockOrdersDAL.getOrders.mockResolvedValue(mockOrders);

      const result = await ordersService.getOrders(query);

      expect(mockOrdersDAL.getOrders).toHaveBeenCalledWith(
        OrderStatus.IN_DELIVERY,
      );
      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrder', () => {
    it('should call getOrder with valid id and return order with orderItems', async () => {
      const ordersService = await createTestingModule();

      const params: GetOrderParamsDto = { orderId: '1' };
      const mockOrderItems = [
        {
          id: '3',
          status: OrderStatus.IN_DELIVERY,
          total_price: 50,
          quantity: 1,
          meal_name: 'Sushi',
          price: 20,
        },
        {
          id: '3',
          status: OrderStatus.IN_DELIVERY,
          total_price: 50,
          quantity: 2,
          meal_name: 'Ramen',
          price: 15,
        },
      ];
      const mockResult = {
        id: '3',
        status: OrderStatus.IN_DELIVERY,
        total_price: 50,
        order_items: [
          { quantity: 1, meal_name: 'Sushi', price: 20 },
          { quantity: 2, meal_name: 'Ramen', price: 15 },
        ],
      };

      mockOrdersDAL.getOrder.mockResolvedValue(mockOrderItems);

      const result = await ordersService.getOrder(params);

      expect(mockOrdersDAL.getOrder).toHaveBeenCalledWith(params.orderId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('calculateTotalPrice', () => {
    it('should return valid total price number', async () => {
      const ordersService = await createTestingModule();

      const mockParams = [
        { mealId: 1, quantity: 5 },
        { mealId: 2, quantity: 3 },
      ];
      const mockMeals = [
        { id: 1, price: 10 },
        { id: 2, price: 20.31 },
      ];

      mockMealsDAL.getMealsByIds.mockResolvedValue(mockMeals);

      const result = await ordersService.calculateTotalPrice(mockParams);

      expect(mockMealsDAL.getMealsByIds).toHaveBeenCalledWith([1, 2]);
      expect(result).toEqual(110.93);
    });
  });
});
