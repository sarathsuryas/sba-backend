import type { RoleName, User } from '../users/users.types.js';

/** Claims carried in the access token; read by the guards. */
export interface JwtPayload {
  sub: string;
  roles: RoleName[];
}

/** A user plus the credential fields only the auth flow may see. */
export interface AuthUser extends User {
  passwordHash: string;
  failedLoginAttempts: number;
}
