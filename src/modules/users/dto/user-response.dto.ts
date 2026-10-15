import type { RoleName, User, UserStatus } from '../users.types.js';

export class UserResponseDto {
  id: string;
  customerId: string | null;
  email: string;
  status: UserStatus;
  roles: RoleName[];
  mustChangePassword: boolean;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  static from(user: User): UserResponseDto {
    return Object.assign(new UserResponseDto(), {
      id: user.id,
      customerId: user.customerId,
      email: user.email,
      status: user.status,
      roles: user.roles,
      mustChangePassword: user.mustChangePassword,
      lockedUntil: user.lockedUntil,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
