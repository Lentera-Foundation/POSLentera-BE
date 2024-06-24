import { Controller, Get } from '@nestjs/common';
import { GlobalService } from './global.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @ApiTags('Global')
  @Get('payment-method')
  getPaymentMethod() {
    return this.globalService.getPaymentMethod();
  }
}
