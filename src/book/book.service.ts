import { Injectable } from '@nestjs/common';
import { Book, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/model/prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Book[]> {
    return this.prisma.book.findMany();
  }

  findOneById(id: Prisma.BookWhereUniqueInput): Promise<Book> {
    return this.prisma.book.findUnique({ where: id });
  }

  create(data: Prisma.BookCreateInput): Promise<Book> {
    return this.prisma.book.create({ data });
  }

  update(
    id: Prisma.BookWhereUniqueInput,
    data: Prisma.BookUpdateInput,
  ): Promise<Book> {
    return this.prisma.book.update({ data, where: id });
  }

  delete(id: Prisma.BookWhereUniqueInput): any {
    return this.prisma.book.delete({ where: id });
  }
}
