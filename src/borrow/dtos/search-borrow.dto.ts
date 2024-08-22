import { IsNumber, IsOptional } from 'class-validator';

export class SearchBorrowDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsOptional()
  @IsNumber()
  bookId: number;
}
