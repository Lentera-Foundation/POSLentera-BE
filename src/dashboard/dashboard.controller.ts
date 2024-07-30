import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/libs/guard';
import { CardDashboardDto, SalesTrendDashboardDto } from 'src/libs/dto';
import { TCardDashboardRequest } from 'src/libs/entities';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/cards/order-distribution')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getOrderDistribution() {
    return this.dashboardService.getOrderDistribution();
  }

  @Get('/line-chart/sales-trend/monthly')
  // @UseGuards(JwtGuard)
  // @ApiBearerAuth()
  // @ApiQuery({ type: SalesTrendDashboardDto })
  getSalesTrendMonthly() {
    return this.dashboardService.getSalesTrendMonthly();
  }

  @Get('/line-chart/sales-trend/yearly')
  // @UseGuards(JwtGuard)
  // @ApiBearerAuth()
  // @ApiQuery({ type: SalesTrendDashboardDto })
  getSalesTrendYearly() {
    return this.dashboardService.getSalesTrendYearly();
  }

  @Get('/doughnut/payment-method')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiQuery({ type: CardDashboardDto })
  getPaymentMethod(@Query() payload) {
    return this.dashboardService.getPaymentMethod(payload);
  }

  @Get('/sales-data')
  // @UseGuards(JwtGuard)
  // @ApiBearerAuth()
  @ApiQuery({ type: CardDashboardDto })
  getSalesData(@Query() payload) {
    return this.dashboardService.getSalesData(payload);
  }
}
