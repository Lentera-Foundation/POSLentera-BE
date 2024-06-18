import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/libs/guard';
import { CardDashboardDto } from 'src/libs/dto';
import { TCardDashboardRequest } from 'src/libs/entities';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/cards')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiQuery({ type: CardDashboardDto })
  getCards(@Query() payload: TCardDashboardRequest) {
    return this.dashboardService.getCards(payload);
  }

  @Get('/line-chart/sales-trend')
  // @UseGuards(JwtGuard)
  // @ApiBearerAuth()
  @ApiQuery({ type: CardDashboardDto })
  getSalesTrend(@Query() payload) {
    return this.dashboardService.getSalesTrend(payload);
  }

  @Get('/doughnut/payment-method')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiQuery({ type: CardDashboardDto })
  getPaymentMethod(@Query() payload) {
    return this.dashboardService.getPaymentMethod(payload);
  }
}
