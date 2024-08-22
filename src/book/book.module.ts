import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaService } from 'src/model/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from './category/category.module';
import { BorrowModule } from 'src/borrow/borrow.module';

@Module({
  imports: [AuthModule, CategoryModule, forwardRef(() => BorrowModule)],
  providers: [BookService, PrismaService],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
