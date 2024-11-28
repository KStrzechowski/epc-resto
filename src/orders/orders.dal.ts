import { Injectable } from '@nestjs/common';
import { Database } from '../types/database';
import { NewOrder, NewOrderItem } from './orders.entity';
import { MEALS_TABLE, ORDER_ITEMS_TABLE, ORDERS_TABLE } from '../constants';
import { getInsertManyQuery, getInsertQuery } from '../helpers';

@Injectable()
export class OrdersDataAccessLayer extends Database {
  public async createOrder(order: NewOrder, orderItems: NewOrderItem[]) {
    let orderResult = { rows: [] };
    // get query and field values for order insert
    const insertOrderQuery = await getInsertQuery(ORDERS_TABLE, order);

    const client = await this.pg.connect();

    try {
      await client.query('BEGIN');
      // save order
      orderResult = await client.query(
        insertOrderQuery.query,
        insertOrderQuery.values,
      );

      // get query and field values for order items insert
      const insertOrderItemQuery = await getInsertManyQuery(
        ORDER_ITEMS_TABLE,
        orderItems,
      );
      console.log(insertOrderItemQuery);
      // save order items
      await client.query(
        insertOrderItemQuery.query,
        insertOrderItemQuery.values,
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return orderResult.rows[0];
  }

  public async getOrders(status?: string) {
    const sqlQuery = `
      SELECT * from ${ORDERS_TABLE}
      ${status ? 'WHERE status = $1' : ''}
    `;
    const values = status ? [status] : [];

    const result = await this.pg.query(sqlQuery, values);

    return result.rows;
  }

  public async getOrder(id: string) {
    const result = await this.pg.query(
      `
      SELECT 
        O.id AS id,
        O.status AS status,
        O.total_price AS total_price,
        OI.quantity AS quantity,
        M.name AS meal_name,
        M.price AS price
      FROM (
        SELECT * 
        FROM ${ORDERS_TABLE}
        WHERE id = $1 
      ) O
      JOIN ${ORDER_ITEMS_TABLE} OI ON O.id = OI.order_id
      JOIN ${MEALS_TABLE} M ON OI.meal_id = M.id`,
      [id],
    );

    return result.rows;
  }
}
