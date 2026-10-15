import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { USER_STATUSES, type UserStatus } from '../users.types.js';

export class UpdateUserDto {
  /** @example jane.doe@example.com */
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  /** @example CUST000123 */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  customerId?: string;

  /** @example deactivated */
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatus;
}
