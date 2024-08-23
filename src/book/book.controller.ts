import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { AuthService } from 'src/auth/auth.service';
import { instanceToPlain } from 'class-transformer';
import { Book } from '@prisma/client';
import { SearchBookDto } from './dtos/search-book.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookDto } from './dtos/book.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Serialize(BookDto)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('all')
  findAllBook(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get('/find/:id')
  findBookById(@Param('id') id: string): Promise<Book> {
    return this.bookService.findOneById({ id: Number(id), removedDate: null });
  }

  @Get('search')
  findByFilter(@Query() query: SearchBookDto): Promise<Book[]> {
    if (Object.keys(query).length < 1) return null;
    return this.bookService.findByFilter(query);
  }

  @Get('search/categories')
  findByCategories(@Query() query: SearchBookDto): Promise<Book[]> {
    return this.bookService.findBookByCategory(query);
  }

  @Get('/most')
  findMostBorrowBook(): Promise<Book> {
    return this.bookService.findBookWithMostBorrowed();
  }

  @Post('create')
  @UseGuards(AdminGuard)
  async createBook(@Body() body: CreateBookDto): Promise<Book> {
    return this.bookService.create(body);
  }

  @Patch('update/:id')
  @UseGuards(AdminGuard)
  async update(@Body() body: Partial<CreateBookDto>, @Param('id') id: string) {
    const bodyObj = instanceToPlain(body);

    if (Object.keys(bodyObj).length < 1)
      throw new BadRequestException('Please provide information');

    return this.bookService.update({ id: Number(id) }, body);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    return this.bookService.delete({ id: Number(id) });
  }
}
