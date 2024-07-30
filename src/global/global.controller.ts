import { Controller, Get } from '@nestjs/common';
import { GlobalService } from './global.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Global')
@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Get('payment-method')
  getPaymentMethod() {
    return this.globalService.getPaymentMethod();
  }

  @Get('order-method')
  getOrderMethod() {
    return this.globalService.getOrderMethod();
  }

  @Get('filter-type')
  getFilterType() {
    return this.globalService.getFilterType();
  }
}
