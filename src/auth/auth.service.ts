import { ForbiddenException, Injectable } from '@nestjs/common';
import { SigninDto, SignupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async signup(signupDto: SignupDto): Promise<any> {
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

      return user;
    } catch (error) {
      return `Error ${error}`;
    }
  }

  async signin(signinDto: SigninDto) {
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

    return this.generateToken(user.id, user.email);
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
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }
}
