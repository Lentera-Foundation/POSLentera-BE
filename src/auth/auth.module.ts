import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/libs/strategy';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [JwtModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailerService],
})
export class AuthModule {}
