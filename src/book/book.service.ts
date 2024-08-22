import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from 'src/model/prisma.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { CategoryService } from './category/category.service';
import { SearchBookDto } from './dtos/search-book.dto';
import { BorrowService } from 'src/borrow/borrow.service';

@Injectable()
export class BookService {
  constructor(
    @Inject(forwardRef(() => BorrowService))
    private borrowService: BorrowService,
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async findBookByCategory(categories: SearchBookDto) {
    const bookWithCatego =
      await this.categoryService.findBookWithMatchCategory(categories);
    if (!bookWithCatego) return null;

    const bookIdArr: Array<number> = bookWithCatego.map((item) => item.bookId);

    return this.prisma.book.findMany({
      where: {
        id: {
          in: bookIdArr,
        },
      },
    });
  }

  findAll(): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        removedDate: null,
      },
    });
  }

  findOneById(id: Prisma.BookWhereUniqueInput): Promise<Book> {
    return this.prisma.book.findUnique({ where: id });
  }

  findByFilter(data: SearchBookDto): Promise<Book[]> {
    const filterObj = {};

    for (const key in data) {
      if (typeof data[key] === 'string') {
        filterObj[key] = {
          contains: data[key],
        };
      }
    }

    return this.prisma.book.findMany({
      where: { ...filterObj, removedDate: null },
    });
  }

  async findBookWithMostBorrowed() {
    const countArr = await this.borrowService.findBookWithMostBorrow();
    return await this.findOneById({
      id: countArr[0].bookId,
    });
  }

  async create(data: CreateBookDto) {
    const { categories } = data;
    delete data.categories;

    const categoId = await this.categoryService.getAllIdByName(categories);

    return await this.prisma.$transaction(async (tx) => {
      const book = await tx.book.create({ data: data });
      const bookAndCatego = categoId.map((item) => ({
        ...item,
        bookId: book.id,
      }));
      await tx.bookCategory.createMany({ data: bookAndCatego });
      return book;
    });
  }

  update(
    id: Prisma.BookWhereUniqueInput,
    data: Prisma.BookUpdateInput,
  ): Promise<Book> {
    return this.prisma.book.update({ data, where: id });
  }

  delete(id: Prisma.BookWhereUniqueInput): any {
    return this.prisma.book.update({
      data: { removedDate: new Date(Date.now()) },
      where: id,
    });
  }
}
