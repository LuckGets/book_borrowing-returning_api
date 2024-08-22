import { forwardRef, Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { PrismaService } from 'src/model/prisma.service';
import { BookModule } from 'src/book/book.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule, forwardRef(() => BookModule), AuthModule],
  providers: [BorrowService, PrismaService],
  controllers: [BorrowController],
  exports: [BorrowService],
})
export class BorrowModule {}
