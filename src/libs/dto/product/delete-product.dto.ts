import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteBatchDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  data: [];
}
