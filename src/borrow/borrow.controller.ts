import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBorrowDto } from './dtos/create-borrow.dto';
import { Borrow } from '@prisma/client';
import { BorrowService } from './borrow.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { SearchBorrowDto } from './dtos/search-borrow.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('borrow')
export class BorrowController {
  constructor(
    private borrowService: BorrowService,
    private authService: AuthService,
  ) {}

  @Get('/search')
  findByQuery(@Query() query: SearchBorrowDto) {
    if (Object.keys(query).length < 1) return null;

    return this.borrowService.findByFilter(query);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create')
  async create(
    @Headers() headers,
    @Body() data: CreateBorrowDto,
  ): Promise<Borrow> {
    const accessToken = headers.authorization.split('Bearer')[1].slice(1);
    const isAdmin = await this.authService.isAdmin(accessToken);

    if (!isAdmin) throw new ForbiddenException('Permission Denied');

    return this.borrowService.create(data);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update/:bookId')
  async update(
    @Headers() headers,
    @Body() data: Partial<CreateBorrowDto>,
    @Param('bookId') bookId: string,
  ): Promise<Borrow> {
    const accessToken = headers.authorization.split('Bearer')[1].slice(1);
    const isAdmin = await this.authService.isAdmin(accessToken);

    if (!isAdmin) throw new ForbiddenException('Permission Denied');

    return this.borrowService.update(Number(bookId), data);
  }
}
