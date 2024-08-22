import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { BorrowModule } from './borrow/borrow.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, BookModule, BorrowModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
