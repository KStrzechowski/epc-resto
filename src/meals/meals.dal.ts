import { CATEGORIES_TABLE, MEALS_TABLE } from '../constants';
import { Database } from '../types/database';

export class MealsDataAccessLayer extends Database {
  public async getMeals(categoryId?: number) {
    const sqlQuery = `
      SELECT 
        M.id AS id,
        M.name AS name,
        C.name AS category_name,
        M.price AS price
      FROM (
        SELECT * 
        FROM ${MEALS_TABLE}
        ${categoryId ? 'WHERE category_id = $1' : ''}
      ) M
      JOIN ${CATEGORIES_TABLE} C ON M.category_id = C.id
    `;

    const values = categoryId ? [categoryId] : [];

    const result = await this.pg.query(sqlQuery, values);

    return result.rows;
  }

  public async getMealsByIds(ids: number[]) {
    const sqlQuery = `
    SELECT id, price FROM ${MEALS_TABLE}
    WHERE id = ANY($1)
  `;

    const result = await this.pg.query(sqlQuery, [ids]);

    return result.rows;
  }
}
