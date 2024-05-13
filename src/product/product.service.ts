import { Injectable } from '@nestjs/common';
import {
  TCreateProductRequest,
  TCreateProductResponse,
} from 'src/libs/entities';
import { TGetProductResponse } from 'src/libs/entities/types/product/get-product.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    payload: TCreateProductRequest,
  ): Promise<TCreateProductResponse> {
    try {
      const { product_name, quantity, price, desc, category_id } = payload;
      await this.prisma.product.create({
        data: {
          product_name,
          quantity,
          price,
          desc,
          category_id,
        },
      });

      return {
        message: 'Success',
        id: 1,
        product_name,
        desc,
        quantity,
        price,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async findAll(): Promise<TGetProductResponse> {
    try {
      const products = await this.prisma.product.findMany({
        orderBy: {
          id: 'desc',
        },
      });

      return {
        message: 'Success',
        data: products,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.prisma.product.findMany({
        where: {
          id,
        },
      });

      return {
        message: 'Success',
        data: product,
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
    payload: TCreateProductRequest,
  ): Promise<TCreateProductResponse> {
    try {
      const { product_name, quantity, price, desc, category_id } = payload;
      await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          product_name,
          quantity,
          price,
          desc,
          category_id,
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

  async remove(id: number) {
    try {
      await this.prisma.product.delete({
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
