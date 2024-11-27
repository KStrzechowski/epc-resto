import { Pool } from 'pg';

export interface Database {
  pg: Pool;
}
