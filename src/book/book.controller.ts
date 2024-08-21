import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dtos/create-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/:id')
  findBookById(@Param('id') id: string) {
    return this.bookService.findOneById({ id: Number(id) });
  }

  @Post('create')
  createBook(@Body() body: CreateBookDto) {
    return this.bookService.create(body);
  }

  @Patch('update/:id')
  update(@Body() body: Partial<CreateBookDto>, @Param() id: string) {
    return this.bookService.update({ id: Number(id) }, body);
  }
}
