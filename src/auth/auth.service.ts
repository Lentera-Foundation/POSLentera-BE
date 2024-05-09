import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import {
  emailTemplate,
  TSendOtpRequest,
  TSendOtpResponse,
  TSigninRequest,
  TSigninResponse,
  TSignupRequest,
  TSignupResponse,
  TUpdatePasswordRequest,
  TUpdatePasswordResponse,
  TVerifyOtpRequest,
  TVerifyOtpResponse,
} from 'src/libs/entities';
import { expiredAt, generateOTP } from 'src/libs/utils';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {}
  async signup(payload: TSignupRequest): Promise<TSignupResponse> {
    try {
      const { fullname, email, username, password } = payload;
      const hashedPass = await argon.hash(password);

      const isEmailExist = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (isEmailExist) {
        throw new ForbiddenException('Email already exist');
      }

      const user = await this.prisma.user.create({
        data: {
          fullname: fullname,
          email: email,
          username: username,
          password: hashedPass,
        },
      });

      return {
        message: 'Success',
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async signin(payload: TSigninRequest): Promise<TSigninResponse> {
    try {
      const { email, password } = payload;

      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const isMatches = await argon.verify(user.password, password);
      if (!isMatches) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const accessToken = await this.generateToken(user.id, user.email);

      return {
        message: 'Success',
        access_token: accessToken,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async generateToken(userId: number, email: string): Promise<string> {
    try {
      const payload = {
        sub: userId,
        email,
      };
      const token = await this.jwt.signAsync(payload, {
        expiresIn: '999h',
        secret: process.env.JWT_SECRET,
      });

      return token;
    } catch (error) {
      return 'Something went wrong!';
    }
  }

  async resendOtp(payload: TSendOtpRequest): Promise<TSendOtpResponse> {
    try {
      const { email } = payload;

      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
        include: {
          otp: true,
        },
      });

      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const data = await this.prisma.otp.upsert({
        where: {
          user_id: user.id,
        },
        update: {
          otp: generateOTP(),
          expiredAt: expiredAt(),
        },
        create: {
          user_id: user.id,
          otp: generateOTP(),
          expiredAt: expiredAt(),
        },
      });

      const html = emailTemplate(
        user.fullname,
        data.otp,
        'verifikasi akun anda',
      );

      const send = await this.mailer.sendMail({
        email,
        subject: 'Reset Password',
        html,
      });

      if (!send) {
        throw new InternalServerErrorException('Failed to send email', send);
      }

      return {
        message: 'Success',
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async verifyOtp(payload: TVerifyOtpRequest): Promise<TVerifyOtpResponse> {
    try {
      const { email, otp } = payload;

      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const otpRecord = await this.prisma.otp.findFirst({
        where: {
          user_id: user.id,
          otp: otp,
        },
      });

      if (!otpRecord) {
        throw new ForbiddenException('OTP Inccorect');
      }
      const now = expiredAt();
      if (otpRecord.expiredAt > now) {
        throw new ForbiddenException('OTP Expired');
      }

      return {
        message: 'Success',
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  async updatePassword(
    payload: TUpdatePasswordRequest,
  ): Promise<TUpdatePasswordResponse> {
    try {
      const { email, password } = payload;
      const hashedPass = await argon.hash(password);

      await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPass,
        },
      });

      return {
        message: 'Success',
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }
}
