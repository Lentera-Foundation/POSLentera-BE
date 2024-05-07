import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    OrderModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
