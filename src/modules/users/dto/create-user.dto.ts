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
  @IsEmail()
  @MaxLength(200)
  email: string;

  /** Temporary password; the user must change it on first login. */
  @IsString()
  @MinLength(12)
  @MaxLength(72)
  password: string;

  @IsIn(ROLE_NAMES)
  role: RoleName;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  customerId?: string;
}
