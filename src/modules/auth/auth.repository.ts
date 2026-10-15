import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import type { Pool } from 'pg';
import { PG_POOL } from '../../database/database.constants.js';
import type { AuthUser } from './auth.types.js';

/**
 * SQL for the login flow. Returned AuthUser objects use camelCase fields and
 * include `roles` (role names from user_roles) plus password_hash and
 * failed_login_attempts.
 */
@Injectable()
export class AuthRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  /** Match case-insensitively: WHERE LOWER(email) = LOWER($1). */
  findByEmail(email: string): Promise<AuthUser | null> {
    throw new NotImplementedException();
  }

  findById(userId: string): Promise<AuthUser | null> {
    throw new NotImplementedException();
  }

  /** Set failed_login_attempts and locked_until to the given values. */
  recordFailedLogin(
    userId: string,
    failedAttempts: number,
    lockedUntil: Date | null,
  ): Promise<void> {
    throw new NotImplementedException();
  }

  /** Reset failed_login_attempts to 0, clear locked_until, set last_login_at = now(). */
  recordSuccessfulLogin(userId: string): Promise<void> {
    throw new NotImplementedException();
  }

  /** Set password_hash, must_change_password = FALSE, updated_at = now(). */
  updatePassword(userId: string, passwordHash: string): Promise<void> {
    throw new NotImplementedException();
  }
}
