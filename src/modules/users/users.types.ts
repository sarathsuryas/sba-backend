export const ROLE_NAMES = ['customer', 'staff', 'admin'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const USER_STATUSES = ['active', 'deactivated'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

/** A users row (camelCase) plus its role names from user_roles. */
export interface User {
  id: string;
  customerId: string | null;
  email: string;
  status: UserStatus;
  mustChangePassword: boolean;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  roles: RoleName[];
}

export interface NewUser {
  email: string;
  passwordHash: string;
  customerId: string | null;
  createdBy: string;
  role: RoleName;
}

export interface UserChanges {
  email?: string;
  customerId?: string | null;
  status?: UserStatus;
}
