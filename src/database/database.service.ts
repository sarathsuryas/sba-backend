import { Inject, Injectable } from '@nestjs/common';
import type { Pool, PoolClient, QueryResultRow } from 'pg';
import { PG_POOL } from './database.constants.js';

/** Either the shared pool or a client checked out for a transaction. */
export type Queryable = Pool | PoolClient;

@Injectable()
export class DatabaseService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async query<T extends QueryResultRow>(
    sql: string,
    params: unknown[] = [],
    db: Queryable = this.pool,
  ): Promise<T[]> {
    const result = await db.query<T>(sql, params);
    return result.rows;
  }

  async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
