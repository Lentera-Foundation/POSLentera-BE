import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/libs/guard';
import { GetUser } from 'src/libs/decorator';
import { OtpDto, SigninDto, SignupDto, UpdatePasswordDto } from 'src/libs/dto';
import { TSignin, TSignup, TUpdatePassword } from 'src/libs/entities';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: SignupDto })
  signup(@Body() signupDto: TSignup) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiBody({ type: SigninDto })
  signin(@Body() signinDto: TSignin) {
    return this.authService.signin(signinDto);
  }

  @Post('resend-otp')
  @HttpCode(200)
  @ApiBody({ type: OtpDto })
  resendOtp(@Body() otpDto: OtpDto) {
    return this.authService.resendOtp(otpDto);
  }

  @Post('verify-otp')
  @HttpCode(200)
  @ApiBody({ type: OtpDto })
  verifyOtp(@Body() otpDto: OtpDto) {
    return this.authService.verifyOtp(otpDto);
  }

  @UseGuards(JwtGuard)
  @Post('update-password')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePasswordDto })
  updatePassword(
    @GetUser() user: any,
    @Body() updatePasswordDto: TUpdatePassword,
  ) {
    return this.authService.updatePassword(user, updatePasswordDto);
  }
}
