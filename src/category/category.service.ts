import { Injectable } from '@nestjs/common';
import {
  TCreateCategoryRequest,
  TCreateCategoryResponse,
} from 'src/libs/entities/types/category/create-category.type';
import { TGetCategoryResponse } from 'src/libs/entities/types/category/get-category.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    payload: TCreateCategoryRequest,
  ): Promise<TCreateCategoryResponse> {
    try {
      const { category_name, desc } = payload;

      const category = await this.prisma.category.create({
        data: {
          category_name,
          desc,
        },
      });

      return {
        message: 'Category created successfully',
        id: category.id,
        category_name,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async findAll(): Promise<TGetCategoryResponse> {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: {
          id: 'desc',
        },
      });
      return {
        message: 'Success',
        data: categories,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async findOne(id: number): Promise<TGetCategoryResponse> {
    try {
      const category = await this.prisma.category.findMany({
        where: {
          id,
        },
      });

      return {
        message: 'Success',
        data: category,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async update(
    id: number,
    payload: TCreateCategoryRequest,
  ): Promise<TCreateCategoryResponse> {
    try {
      const { category_name, desc } = payload;

      await this.prisma.category.update({
        where: {
          id: Number(id),
        },
        data: {
          category_name,
          desc,
        },
      });

      return {
        message: 'Success',
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async remove(id: number): Promise<TCreateCategoryResponse> {
    try {
      await this.prisma.category.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Success',
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }
}
