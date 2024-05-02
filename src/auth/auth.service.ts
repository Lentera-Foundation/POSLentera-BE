import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { TSignin, TSignup, TUpdatePassword } from 'src/libs/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
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
