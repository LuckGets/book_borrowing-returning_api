import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/model/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateBorrowDto } from './dtos/create-borrow.dto';
import { BookService } from 'src/book/book.service';
import { Borrow, Prisma } from '@prisma/client';
import { SearchBorrowDto } from './dtos/search-borrow.dto';

@Injectable()
export class BorrowService {
  constructor(
    @Inject(forwardRef(() => BookService))
    private bookService: BookService,
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async findByFilter(data: SearchBorrowDto) {
    const filterObj = {};

    for (const key in data) {
      if (typeof data[key] === 'string') {
        filterObj[key] = {
          contains: data[key],
        };
      }
    }

    return this.prisma.book.findMany({
      where: filterObj,
    });
  }

  async create(data: CreateBorrowDto): Promise<Borrow> {
    const isUserExist = await this.userService.findUserById({
      id: data.userId,
    });
    const isBookExist = await this.bookService.findOneById({ id: data.bookId });
    if (!isUserExist || !isBookExist)
      throw new BadRequestException('User or Book does not exist.');

    const isBookBorrowing = await this.checkIfBookWasBorrowed(isBookExist.id);

    if (isBookBorrowing)
      throw new BadRequestException('The book is now borrowing');

    return this.prisma.borrow.create({ data: data });
  }

  async update(id: number, data: Partial<CreateBorrowDto>) {
    return this.prisma.borrow.update({ data: data, where: { id } });
  }

  async checkIfBookWasBorrowed(bookId: number): Promise<Boolean> {
    const book = await this.bookService.findOneById({ id: bookId });

    if (!book) throw new BadRequestException('Book does not exist.');

    const isBookBorrowing =
      (await this.prisma.borrow.findFirst({
        where: {
          bookId: book.id,
          returnDate: null,
        },
      })) || {};

    return Object.keys(isBookBorrowing).length > 1;
  }

  async findBookWithMostBorrow() {
    const countArr = await this.prisma.borrow.groupBy({
      by: ['bookId'],
      _count: {
        bookId: true,
      },
    });
    return countArr
      .map((item) => ({ bookId: item.bookId, count: item._count.bookId }))
      .sort((a, b) => b.count - a.count);
  }
}
