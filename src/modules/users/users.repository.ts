import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import type { Pool } from 'pg';
import { PG_POOL } from '../../database/database.constants.js';
import type { NewUser, User, UserChanges } from './users.types.js';

/**
 * SQL for users. Every method that returns a User must map snake_case
 * columns to camelCase and include `roles` (role names from user_roles,
 * e.g. via array_agg). Never return password_hash from here.
 */
@Injectable()
export class UsersRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  /** Newest first. */
  findAll(limit: number, offset: number): Promise<User[]> {
    throw new NotImplementedException();
  }

  findById(id: string): Promise<User | null> {
    throw new NotImplementedException();
  }

  /**
   * Insert the user with must_change_password = TRUE and assign `data.role`
   * in user_roles, atomically (transaction or CTE). Store email lowercased.
   */
  create(data: NewUser): Promise<User> {
    throw new NotImplementedException();
  }

  /** Update only the fields present in `changes`; set updated_at = now(). */
  update(id: string, changes: UserChanges): Promise<User | null> {
    throw new NotImplementedException();
  }

  /** Returns false when no row was deleted. */
  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
