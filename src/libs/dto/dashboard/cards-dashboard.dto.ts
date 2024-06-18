import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class CardDashboardDto {
  @ApiProperty({ example: '2024-06-01', required: false })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ example: '2024-06-30', required: false })
  @IsDateString()
  @IsOptional()
  end_date?: string;
}
