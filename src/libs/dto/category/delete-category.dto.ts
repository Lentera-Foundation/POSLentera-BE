import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteCategoryBatchDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  data: [];
}
