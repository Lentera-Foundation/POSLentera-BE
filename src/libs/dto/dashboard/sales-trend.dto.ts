import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class SalesTrendDashboardDto {
  @ApiProperty({ example: '2024-06-01', required: false })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ example: '2024-06-30', required: false })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({ example: 'Monthly' })
  @IsString()
  @IsEnum(['Yearly', 'Monthly', 'Daily'])
  filter_type?: string;
}
