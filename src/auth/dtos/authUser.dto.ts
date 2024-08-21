import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Role } from 'src/types/role';

export class UserSignInDto {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}

export class UserSignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  role: Role;
}
