import { Injectable } from '@nestjs/common';
import {
  DatabaseService,
  type Queryable,
} from '../../database/database.service.js';
import type { User } from './users.types.js';

interface UserRow {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

const COLUMNS = 'id, email, name, created_at, updated_at';

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** All SQL for the users table. Pass `db` to run inside a transaction. */
@Injectable()
export class UsersRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(limit: number, offset: number, db?: Queryable) {
    const rows = await this.database.query<UserRow>(
      `SELECT ${COLUMNS} FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
      db,
    );
    return rows.map(toUser);
  }

  async findById(id: string, db?: Queryable): Promise<User | null> {
    const [row] = await this.database.query<UserRow>(
      `SELECT ${COLUMNS} FROM users WHERE id = $1`,
      [id],
      db,
    );
    return row ? toUser(row) : null;
  }

  async create(
    data: { email: string; name: string },
    db?: Queryable,
  ): Promise<User> {
    const [row] = await this.database.query<UserRow>(
      `INSERT INTO users (email, name) VALUES ($1, $2) RETURNING ${COLUMNS}`,
      [data.email, data.name],
      db,
    );
    return toUser(row);
  }

  async update(
    id: string,
    data: { email?: string; name?: string },
    db?: Queryable,
  ): Promise<User | null> {
    const [row] = await this.database.query<UserRow>(
      `UPDATE users
          SET email = COALESCE($2, email),
              name = COALESCE($3, name),
              updated_at = now()
        WHERE id = $1
        RETURNING ${COLUMNS}`,
      [id, data.email ?? null, data.name ?? null],
      db,
    );
    return row ? toUser(row) : null;
  }

  async delete(id: string, db?: Queryable): Promise<boolean> {
    const rows = await this.database.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id],
      db,
    );
    return rows.length > 0;
  }
}
