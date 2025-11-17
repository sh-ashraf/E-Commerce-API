import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  cPassword: string;
}
