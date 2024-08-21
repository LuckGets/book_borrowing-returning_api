import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserSignInDto, UserSignUpDto } from './dtos/authUser.dto';
import { User } from '@prisma/client';
import { Role } from 'src/types/role';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async singIn(@Body() body: UserSignInDto): Promise<{ access_token: string }> {
    if (!body.email && !body.phone)
      throw new BadRequestException('Please provide email or phone');

    let payload;
    if (body.phone) {
      payload = this.authService.signIn(body.email, body.password);
    }
    if (body.phone) {
      payload = this.authService.signIn(body.phone, body.password);
    }

    if (!payload)
      throw new BadRequestException('Email or Phone does not exist.');

    return payload;
  }

  @Post('signup')
  async signUp(@Body() body: UserSignUpDto): Promise<User> {
    body.role = Role.user;
    const user = await this.authService.createUser(body);

    if (!user)
      throw new BadRequestException(
        'Email or Phone already in use. Please provide new information',
      );

    return user;
  }
}
