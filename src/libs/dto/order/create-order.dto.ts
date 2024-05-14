import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: [
      { product_id: 1, quantity: 2 },
      { product_id: 3, quantity: 4 },
    ],
  })
  @IsArray()
  product: Array<{
    product_id: number;
    quantity: number;
  }>;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  customer_name: string;

  @ApiProperty({ example: '123 Main Street, Anytown USA' })
  @IsString()
  customer_address: string;

  @ApiProperty({ example: 'Cash' })
  @IsString()
  payment_method: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  discount: number;
}
