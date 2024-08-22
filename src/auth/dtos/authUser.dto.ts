import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Role } from '../auth.service';

export class UserSignInDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(10)
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

  @IsString()
  @Length(10)
  phone: string;

  @IsOptional()
  role: Role;
}

export class Token {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
