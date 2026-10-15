import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { USER_STATUSES, type UserStatus } from '../users.types.js';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  customerId?: string;

  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatus;
}
