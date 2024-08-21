import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async findUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById({ id: Number(id) });
  }
}
