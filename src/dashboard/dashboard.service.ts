import { BadRequestException, Injectable } from '@nestjs/common';
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
  async getOrderDistribution(): Promise<TCardDashboardResponse> {
    try {
      const [
        totalOrder,
        offlineOrder,
        goFoodOrder,
        grabFoodOrder,
        shopeeFoodOrder,
      ] = await Promise.all([
        this.prisma.order.count({}),

        this.prisma.order.count({
          where: {
            order_method: {
              contains: 'Offline',
            },
          },
        }),

        this.prisma.order.count({
          where: {
            order_method: {
              contains: 'GoFood',
            },
          },
        }),

        this.prisma.order.count({
          where: {
            order_method: {
              contains: 'GrabFood',
            },
          },
        }),

        this.prisma.order.count({
          where: {
            order_method: {
              contains: 'ShopeeFood',
            },
          },
        }),
      ]);

      return {
        message: 'Success',
        data: {
          totalOrder,
          offlineOrder,
          goFoodOrder,
          grabFoodOrder,
          shopeeFoodOrder,
        },
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async getSalesTrendByDate(payload: TCardDashboardRequest) {
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

        const average_transaction =
          filteredData.reduce(
            (acc, cur) =>
              acc +
              cur.order_detail.reduce(
                (sum, orderDetail) =>
                  sum + orderDetail.product.price - orderDetail.product.equity,
                0,
              ),
            0,
          ) / filteredData.length || 0;

        return {
          date: date.toISOString().split('T')[0], // Format tanggal menjadi YYYY-MM-DD
          total_income,
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

  async getSalesTrendMonthly() {
    try {
      const data = await this.fetchData();

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

      const monthlyResult = months.map((month) => {
        const filteredData = data.filter((item) => {
          const date = new Date(item.created_at);
          const monthName = date.toLocaleString('default', {
            month: 'long',
          });
          return monthName === month;
        });

        const total_income = filteredData.reduce(
          (acc, cur) => acc + cur.payment_amount,
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
          total_income,
          average_transaction,
        };
      });

      return {
        message: 'Success',
        data: monthlyResult,
      };
    } catch (error) {
      throw new BadRequestException('Something went wrong', error.message);
    }
  }

  async getSalesTrendYearly() {
    try {
      const data = await this.fetchData();

      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

      const yearlyResult = years.map((year) => {
        const filteredData = data.filter((item) => {
          const date = new Date(item.created_at);
          return date.getFullYear() === year;
        });

        const total_income = filteredData.reduce(
          (acc, cur) => acc + cur.payment_amount,
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
          year,
          total_income,
          average_transaction,
        };
      });

      return {
        message: 'Success',
        data: yearlyResult,
      };
    } catch (error) {
      throw new BadRequestException('Something went wrong', error.message);
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

  async getSalesData(payload) {
    const { category_id, order_by = 'asc' } = payload;
    const filter = category_id
      ? {
          product: {
            category_id: Number(category_id),
          },
        }
      : {};

    const [product, category] = await Promise.all([
      this.prisma.orderDetail.findMany({
        include: {
          product: true,
        },
        where: filter,
        orderBy: {
          product: {
            id: 'asc',
          },
        },
      }),

      this.prisma.category.findMany({
        where: {
          id: category_id,
        },
      }),
    ]);

    return {
      message: 'Success',
      data: {
        product,
        category,
      },
    };
  }

  async fetchData() {
    return await this.prisma.order.findMany({
      include: {
        order_detail: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getFrequencyOrder() {
    try {
      const data = await this.fetchData();
      const today = new Date();

      // Define time ranges
      const timeRanges = {
        '09:00 - 14:00': 0,
        '14:00 - 19:00': 0,
        '19:00 - 24:00': 0,
        total: 0,
      };

      // Filter and categorize data based on the current day and time range
      data.forEach((item) => {
        const date = new Date(item.created_at);
        if (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        ) {
          const hour = date.getHours();

          if (hour >= 9 && hour < 14) {
            timeRanges['09:00 - 14:00'] += 1;
          } else if (hour >= 14 && hour < 19) {
            timeRanges['14:00 - 19:00'] += 1;
          } else if (hour >= 19 && hour < 24) {
            timeRanges['19:00 - 24:00'] += 1;
          }

          timeRanges.total += 1;
        }
      });

      return {
        message: 'Success',
        data: timeRanges,
      };
    } catch (error) {
      throw new BadRequestException('Something went wrong', error.message);
    }
  }
}
