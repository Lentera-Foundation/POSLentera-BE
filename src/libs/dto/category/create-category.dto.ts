import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Kopi Hitam' })
  @IsString()
  category_name: string;

  @ApiProperty({ example: 'asadekon' })
  @IsEmail()
  @IsOptional()
  desc?: string;
}
