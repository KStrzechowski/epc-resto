import { Injectable } from '@nestjs/common';
import { Database } from '../types/database';

@Injectable()
export class CategoriesDataAccessLayer extends Database {
  public async getCategories() {
    const result = await this.pg.query(`SELECT * from categories`);

    return result.rows;
  }
}
