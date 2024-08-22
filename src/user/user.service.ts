import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/model/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({ where: id });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findUserByEmailOrPhone(emailOrPhone: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: emailOrPhone,
          },
          {
            phone: emailOrPhone,
          },
        ],
      },
    });
  }

  async update(userId: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id: Number(userId) }, data });
  }
}
