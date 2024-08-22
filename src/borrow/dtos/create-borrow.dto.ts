import { IsNumber, IsOptional } from 'class-validator';

export class CreateBorrowDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  bookId: number;

  @IsOptional()
  returnDate: Date;
}
