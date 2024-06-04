import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductStatus } from 'src/libs/entities';

export class CreateProductDto {
  @ApiProperty({ example: 'Product 1' })
  @IsString()
  product_name: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsEnum(ProductStatus)
  status: boolean;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsOptional()
  equity?: number;

  @ApiProperty({ example: 'Product 1 Desc' })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  category_id: number;

  @ApiProperty({ example: 'https://example.com/image.png' })
  @IsString()
  @IsOptional()
  image_url?: string;
}
