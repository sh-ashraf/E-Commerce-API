import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
export class resendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class VerifyEmailDto extends resendOtpDto {
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code: string;
}
