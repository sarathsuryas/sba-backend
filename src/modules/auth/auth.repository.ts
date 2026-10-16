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

  /**
   * Used by login. Match case-insensitively: WHERE LOWER(email) = LOWER($1).
   * Return null when no row matches.
   *
   * Required fields (alias each column to camelCase, e.g. AS "passwordHash"):
   *   id                  - users.id; JWT `sub`, passed to recordFailedLogin/recordSuccessfulLogin
   *   passwordHash        - users.password_hash; checked against the submitted password
   *   failedLoginAttempts - users.failed_login_attempts; incremented on a wrong password
   *   lockedUntil         - users.locked_until; login is refused while in the future
   *   status              - users.status; login is refused unless 'active'
   *   mustChangePassword  - users.must_change_password; returned in the login response
   *   roles               - role names via user_roles -> roles, as an array ([] when none);
   *                         goes into the JWT
   */
  findByEmail(email: string): Promise<AuthUser | null> {
  
  }

  /**
   * Used by change-password and GET /auth/me. WHERE u.id = $1; return null when no row matches.
   *
   * Required fields: every AuthUser field, because /me returns the full user.
   *   id, email, status, roles (array, [] when none)
   *   customerId          - users.customer_id
   *   passwordHash        - users.password_hash; change-password verifies the current password
   *   failedLoginAttempts - users.failed_login_attempts
   *   mustChangePassword  - users.must_change_password
   *   lockedUntil         - users.locked_until
   *   lastLoginAt         - users.last_login_at
   *   createdBy           - users.created_by
   *   createdAt           - users.created_at
   *   updatedAt           - users.updated_at
   */
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
