import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  getPaymentMethod() {
    return {
      message: 'Success',
      data: {
        payment_method: ['Qris', 'Cash'],
      },
    };
  }

  getOrderMethod() {
    return {
      message: 'Success',
      data: {
        order_method: ['Offline', 'GoFood', 'GrabFood', 'Shopee Food'],
      },
    };
  }

  getFilterType() {
    return {
      message: 'Success',
      data: {
        filter_type: ['Yearly', 'Monthly', 'Daily'],
      },
    };
  }
}
