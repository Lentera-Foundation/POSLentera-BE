// import { PartialType } from '@nestjs/swagger';
// import { SignupDto } from './signup.dto';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password' })
  @IsString()
  password: string;
}
