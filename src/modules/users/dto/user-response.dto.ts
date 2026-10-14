import type { User } from '../users.types.js';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  static from(user: User): UserResponseDto {
    return Object.assign(new UserResponseDto(), {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
