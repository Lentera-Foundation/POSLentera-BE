import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'QsKpO@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john.doe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Password' })
  @IsString()
  password: string;
}
