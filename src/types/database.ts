import { Pool } from 'pg';
import { PostgreSQLPool } from '../postgresql-setup';

export abstract class Database {
  public readonly pg: Pool = PostgreSQLPool.getPool();
}
