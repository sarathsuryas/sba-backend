import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  /** @example StrongPass1! */
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  /** @example An0ther-Strong-Pass */
  // bcrypt only uses the first 72 bytes, so longer passwords are rejected.
  @IsString()
  @MinLength(12)
  @MaxLength(72)
  newPassword: string;
}
