import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  categories: Array<string>;
}
