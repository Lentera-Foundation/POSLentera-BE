import { Injectable } from '@nestjs/common';
import { TCreateOrderRequest } from 'src/libs/entities';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  async create(payload: TCreateOrderRequest) {
    try {
      const { product, customer_name, customer_address, payment_method } =
        payload;

      const result = await this.prisma.$transaction(async (prisma) => {
        const order_number = String((await prisma.order.count()) + 1);
        const products = await prisma.product.findMany({
          where: {
            id: {
              in: product.map((item) => item.product_id),
            },
          },
        });

        const payment_amount = products.reduce(
          (acc, cur) =>
            acc +
            cur.price *
              product.find((item) => item.product_id === cur.id).quantity,
          0,
        );

        const order = await prisma.order.create({
          data: {
            order_number,
            customer_name,
            customer_address,
            payment_method,
            payment_amount: payment_amount + (payment_amount * 11) / 100,
            order_detail: {
              createMany: {
                data: product.map((item) => ({
                  product_id: item.product_id,
                  quantity: item.quantity,
                })),
                skipDuplicates: true,
              },
            },
          },
        });

        return {
          message: 'Success',
          data: order,
        };
      });

      return result;
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async findAll() {
    try {
      const orders = await this.prisma.order.findMany({
        orderBy: {
          id: 'desc',
        },
        include: {
          order_detail: true,
        },
      });

      return {
        message: 'Success',
        data: orders,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async findOne(order_number: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: {
          order_number,
        },
        include: {
          order_detail: true,
        },
      });

      return {
        message: 'Success',
        data: order,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  update(id: number, payload: any) {
    return `This action updates a #${id} order ${payload}`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
