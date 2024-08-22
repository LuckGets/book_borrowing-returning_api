import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { AuthService } from 'src/auth/auth.service';
import { instanceToPlain } from 'class-transformer';
import { Book } from '@prisma/client';
import { SearchBookDto } from './dtos/search-book.dto';
import { query } from 'express';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookDto } from './dtos/book.dto';

@Serialize(BookDto)
@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly authService: AuthService,
  ) {}

  @Get('all')
  findAllBook() {
    return this.bookService.findAll();
  }

  @Get('/find/:id')
  findBookById(@Param('id') id: string): Promise<Book> {
    return this.bookService.findOneById({ id: Number(id), removedDate: null });
  }

  @Get('search')
  findByFilter(@Query() query: SearchBookDto) {
    if (Object.keys(query).length < 1) return null;
    return this.bookService.findByFilter(query);
  }

  @Get('search/categories')
  findByCategories(@Query() query) {
    return this.bookService.findBookByCategory(query);
  }

  @Get('/most')
  findMostBorrowBook() {
    return this.bookService.findBookWithMostBorrowed();
  }

  @Post('create')
  @UseGuards(AccessTokenGuard)
  async createBook(@Headers() headers: any, @Body() body: CreateBookDto) {
    const accessToken = headers.authorization.split('Bearer')[1].slice(1);
    const isAdmin = await this.authService.isAdmin(accessToken);

    if (!isAdmin) throw new ForbiddenException('Permission Denied');

    return this.bookService.create(body);
  }

  @Patch('update/:id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Body() body: Partial<CreateBookDto>,
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    const accessToken = headers.authorization.split('Bearer')[1].slice(1);
    const isAdmin = await this.authService.isAdmin(accessToken);

    if (!isAdmin) throw new ForbiddenException('Permission Denied');

    const bodyObj = instanceToPlain(body);

    if (Object.keys(bodyObj).length < 1)
      throw new BadRequestException('Please provide information');

    return this.bookService.update({ id: Number(id) }, body);
  }

  @Delete('/:id')
  @UseGuards(AccessTokenGuard)
  async delete(@Headers() headers, @Param('id') id: string) {
    const accessToken = headers.authorization.split('Bearer')[1].slice(1);
    const isAdmin = await this.authService.isAdmin(accessToken);

    if (!isAdmin) throw new ForbiddenException('Permission Denied');
    return this.bookService.delete({ id: Number(id) });
  }
}
