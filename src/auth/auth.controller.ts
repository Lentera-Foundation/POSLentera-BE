import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  ResendOtpDto,
  SigninDto,
  SignupDto,
  UpdatePasswordDto,
} from 'src/libs/dto';
import {
  TSigninRequest,
  TSignupRequest,
  TUpdatePasswordRequest,
} from 'src/libs/entities';
import { VerifyOtp } from 'src/libs/dto/auth/verify-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: SignupDto })
  signup(@Body() payload: TSignupRequest) {
    return this.authService.signup(payload);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiBody({ type: SigninDto })
  signin(@Body() payload: TSigninRequest) {
    return this.authService.signin(payload);
  }

  @Post('resend-otp')
  @HttpCode(200)
  @ApiBody({ type: ResendOtpDto })
  resendOtp(@Body() payload: ResendOtpDto) {
    return this.authService.resendOtp(payload);
  }

  @Post('verify-otp')
  @HttpCode(200)
  @ApiBody({ type: VerifyOtp })
  verifyOtp(@Body() payload: VerifyOtp) {
    return this.authService.verifyOtp(payload);
  }

  @Post('update-password')
  @ApiBody({ type: UpdatePasswordDto })
  updatePassword(@Body() payload: TUpdatePasswordRequest) {
    return this.authService.updatePassword(payload);
  }
}
