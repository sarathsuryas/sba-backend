import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  // bcrypt only uses the first 72 bytes, so longer passwords are rejected.
  @IsString()
  @MinLength(12)
  @MaxLength(72)
  newPassword: string;
}
