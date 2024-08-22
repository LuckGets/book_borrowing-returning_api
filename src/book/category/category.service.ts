import { BadRequestException, Injectable } from '@nestjs/common';
import { BookCategory, Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/model/prisma.service';
import { SearchBookDto } from '../dtos/search-book.dto';

interface queryInterface {
  name?: string | Array<string>;

  id?: string | Array<string>;
}

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findManyByName(name: Array<string>): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        name: {
          in: name,
        },
      },
    });
  }

  async findBookWithMatchCategory(
    categories: queryInterface,
  ): Promise<BookCategory[]> {
    const filterObj = {
      id: {
        in: [],
      },
    };

    if ('name' in categories) {
      if (Array.isArray(categories['name'])) {
        const nameArr = categories.name;
        const catIdArr = await this.prisma.category.findMany({
          where: {
            name: {
              in: nameArr,
            },
          },
        });
        catIdArr.forEach((item) => {
          filterObj.id.in.push(item.id);
        });
      } else {
        const catIdArr = await this.prisma.category.findFirst({
          where: {
            name: {
              contains: categories['name'],
            },
          },
        });
        filterObj.id.in.push(catIdArr.id);
      }
    }

    if ('id' in categories) {
      if (Array.isArray(categories['id'])) {
        categories.id.forEach((item) => filterObj.id.in.push(Number(item)));
      } else {
        filterObj.id.in.push(Number(categories.id));
      }
    }

    return this.prisma.bookCategory.findMany({ where: filterObj });
  }

  async getAllIdByName(name: Array<string>): Promise<{ categoryId: number }[]> {
    const catego = await this.findManyByName(name);

    if (catego.length < 1)
      throw new BadRequestException('Invalid Information provided');

    const categoId = catego.map((item) => ({
      categoryId: item.id,
    }));
    return categoId;
  }

  async findOne(input: Prisma.CategoryWhereInput): Promise<Category> {
    return this.prisma.category.findFirst({ where: input });
  }
}
