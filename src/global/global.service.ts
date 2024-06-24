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
}
