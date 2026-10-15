import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ROLE_NAMES, type RoleName } from '../users.types.js';

export class CreateUserDto {
  /** @example jane.doe@example.com */
  @IsEmail()
  @MaxLength(200)
  email: string;

  /**
   * Temporary password; the user must change it on first login.
   * @example Temp-Password-123
   */
  @IsString()
  @MinLength(12)
  @MaxLength(72)
  password: string;

  /** @example customer */
  @IsIn(ROLE_NAMES)
  role: RoleName;

  /** @example CUST000123 */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  customerId?: string;
}
