import { IsString, IsOptional, IsArray } from 'class-validator';

export class SearchBookDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  category: string;
}
