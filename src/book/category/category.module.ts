import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/model/prisma.service';

@Module({
  providers: [CategoryService, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
