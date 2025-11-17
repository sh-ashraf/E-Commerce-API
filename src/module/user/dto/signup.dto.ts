import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsMatch } from '../../../common/decorators/user.decorator';
import { UserGender } from 'src/common/enums/user.enum';
export class signUpDTO {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  @ValidateIf((data: signUpDTO) => Boolean(!data.userName))
  firstName: string;

  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  @ValidateIf((data: signUpDTO) => Boolean(!data.userName))
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  @Max(100)
  age: number;

  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  @ValidateIf((data: signUpDTO) => Boolean(!data.firstName && !data.lastName))
  userName: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsMatch(['password'])
  @ValidateIf((data: signUpDTO) => {
    return Boolean(data.password);
  })
  confirmPassword: string;
  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;
}
