import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Token, UserSignInDto, UserSignUpDto } from './dtos/authUser.dto';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async singIn(@Body() body: UserSignInDto): Promise<{ access_token: string }> {
    if (!body.email && !body.phone)
      throw new BadRequestException('Please provide email or phone');

    let payload;
    if (body.email) {
      payload = await this.authService.signIn(body.email, body.password);
    }
    if (body.phone) {
      payload = await this.authService.signIn(body.phone, body.password);
    }

    if (!payload)
      throw new BadRequestException('Email or Phone does not exist.');

    return payload;
  }

  @Post('signup')
  async signUp(@Body() body: UserSignUpDto): Promise<Token> {
    const token = await this.authService.createUser(body);

    if (!token)
      throw new BadRequestException(
        'Email or Phone already in use. Please provide new information',
      );

    return token;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout/:id')
  logout(@Param('id') id: string) {
    this.authService.logout(Number(id));
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh/:id')
  refreshToken(@Headers() headers, @Param('id') id: string) {
    const refreshToken = headers.authorization.split('Bearer')[1].slice(1);
    return this.authService.refreshToken(Number(id), refreshToken);
  }
}
