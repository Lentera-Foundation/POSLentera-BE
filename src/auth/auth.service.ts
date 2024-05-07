import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  emailTemplate,
  TSignin,
  TSignup,
  TUpdatePassword,
} from 'src/libs/entities';
import { OtpDto } from 'src/libs/dto';
import { expiredAt, generateOTP } from 'src/libs/utils';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {}
  async signup(signupDto: TSignup): Promise<object> {
    try {
      const hashedPass = await argon.hash(signupDto.password);
      const user = await this.prisma.user.create({
        data: {
          fullname: signupDto.fullname,
          email: signupDto.email,
          username: signupDto.username,
          password: hashedPass,
        },
      });

      return {
        message: 'Success',
        data: {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error) {
      return {
        message: 'Error',
        data: error,
      };
    }
  }

  async signin(signinDto: TSignin) {
    const { email, password } = signinDto;
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

    const accesToken = await this.generateToken(user.id, user.email);

    return {
      message: 'Success',
      data: accesToken,
    };
  }

  async generateToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '999h',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }

  async resendOtp(otpDto: OtpDto) {
    const { email } = otpDto;

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

    const html = emailTemplate(user.fullname, data.otp, 'verifikasi akun anda');

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
  }

  async verifyOtp(otpDto: OtpDto) {
    const { email, otp } = otpDto;

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
  }

  async updatePassword(user: User, updatePasswordDto: TUpdatePassword) {
    const { id } = user;
    const { password } = updatePasswordDto;
    const hashedPass = await argon.hash(password);

    try {
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPass,
        },
      });
      return {
        message: 'Success',
      };
    } catch (error) {
      return error;
    }
  }
}
