import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** @example admin1@bank.com */
  @IsEmail()
  email: string;

  /** @example StrongPass1! */
  @IsString()
  @IsNotEmpty()
  password: string;
}
