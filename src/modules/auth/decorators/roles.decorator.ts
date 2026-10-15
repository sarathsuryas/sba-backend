import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/** Allows the route only for users holding at least one of these roles. */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
