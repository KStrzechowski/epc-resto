import { Pool } from 'pg';
import POOL_CONFIG from '@config/postgresql.config';

export class PostgreSQLPool {
  private static pool: Pool;

  static getPool(): Pool {
    if (!this.pool) {
      this.initializePostgreSQL();
    }

    return this.pool;
  }

  private static initializePostgreSQL = async () => {
    this.pool = new Pool(POOL_CONFIG);
  };
}
