import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  TCardDashboardRequest,
  TCardDashboardResponse,
} from 'src/libs/entities';
import { dateRanges } from 'src/libs/utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}
  create() {
    return 'Sukse';
  }
  async getCards(
    payload: TCardDashboardRequest,
  ): Promise<TCardDashboardResponse> {
    const { start_date, end_date } = payload;

    const dateFilter =
      start_date && end_date
        ? {
            created_at: {
              gte: new Date(start_date),
              lte: new Date(end_date),
            },
          }
        : {};

    try {
      const [total_order, total_income, orders, average_transaction] =
        await Promise.all([
          this.prisma.order.count({
            where: dateFilter,
          }),

          this.prisma.order.aggregate({
            _sum: { payment_amount: true },
            where: dateFilter,
          }),

          this.prisma.order.findMany({
            select: {
              id: true,
              order_detail: {
                select: {
                  product: {
                    select: {
                      equity: true,
                      price: true,
                    },
                  },
                },
              },
            },
            where: dateFilter,
          }),

          this.prisma.order.aggregate({
            _avg: { payment_amount: true },
            where: dateFilter,
          }),
        ]);

      const total_net_income = orders.reduce((acc, order) => {
        const orderTotal = order.order_detail.reduce((sum, orderDetail) => {
          return (
            sum + (orderDetail.product.price - orderDetail.product.equity || 0)
          );
        }, 0);
        return acc + orderTotal;
      }, 0);

      return {
        message: 'Success',
        data: {
          total_order,
          total_income: total_income._sum.payment_amount || 0,
          total_net_income,
          average_transaction: average_transaction._avg.payment_amount || 0,
        },
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async getSalesTrend(payload: TCardDashboardRequest) {
    try {
      const { start_date, end_date } = payload;
      const dateFilter =
        start_date && end_date
          ? {
              created_at: {
                gte: new Date(start_date),
                lte: new Date(end_date),
              },
            }
          : {};

      const data = await this.prisma.order.findMany({
        select: {
          id: true,
          payment_amount: true,
          created_at: true,
          order_detail: {
            select: {
              product: true,
            },
          },
        },
        where: dateFilter,
        orderBy: {
          created_at: 'asc',
        },
      });

      if (start_date && end_date) {
        const dates = dateRanges(new Date(start_date), new Date(end_date));
        const result = dates.map((date) => {
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const filteredData = data.filter((item) => {
            const itemDate = new Date(item.created_at);
            return itemDate >= date && itemDate < nextDate;
          });

          const total_income = filteredData.reduce(
            (acc, cur) => acc + cur.payment_amount,
            0,
          );

          const total_net_income = filteredData.reduce(
            (acc, cur) =>
              acc +
              cur.order_detail.reduce(
                (sum, orderDetail) => sum + orderDetail.product.price,
                0,
              ),
            0,
          );

          const average_transaction =
            filteredData.reduce(
              (acc, cur) =>
                acc +
                cur.order_detail.reduce(
                  (sum, orderDetail) =>
                    sum +
                    orderDetail.product.price -
                    orderDetail.product.equity,
                  0,
                ),
              0,
            ) / filteredData.length || 0;

          return {
            date: date.toISOString().split('T')[0], // Format tanggal menjadi YYYY-MM-DD
            total_order: filteredData.length,
            total_income,
            total_net_income,
            average_transaction,
          };
        });

        return {
          message: 'Success',
          data: result,
        };
      }

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const result = months.map((month) => {
        const filteredData = data.filter((item) => {
          const date = new Date(item.created_at);
          const monthName = date.toLocaleString('default', { month: 'long' });
          return monthName === month;
        });

        const total_income = filteredData.reduce(
          (acc, cur) => acc + cur.payment_amount,
          0,
        );

        const total_net_income = filteredData.reduce(
          (acc, cur) =>
            acc +
            cur.order_detail.reduce(
              (sum, orderDetail) => sum + orderDetail.product.price,
              0,
            ),
          0,
        );

        const average_transaction =
          filteredData.reduce(
            (acc, cur) =>
              acc +
              cur.order_detail.reduce(
                (sum, orderDetail) => sum + orderDetail.product.price,
                0,
              ),
            0,
          ) / filteredData.length || 0;

        return {
          month,
          total_order: filteredData.length,
          total_income,
          total_net_income,
          average_transaction,
        };
      });

      return {
        message: 'Success',
        data: result,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async getPaymentMethod(payload: TCardDashboardRequest) {
    const { start_date, end_date } = payload;

    const dateFilter =
      start_date && end_date
        ? {
            created_at: {
              gte: new Date(start_date),
              lte: new Date(end_date),
            },
          }
        : {};

    try {
      const data = await this.prisma.order.findMany({
        select: {
          id: true,
          payment_amount: true,
          payment_method: true,
          created_at: true,
        },
        where: dateFilter,
      });

      return {
        message: 'Success',
        data: {
          qris: data.filter((item) => item.payment_method === 'Qris').length,
          cash: data.filter((item) => item.payment_method === 'Cash').length,
        },
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }
}
