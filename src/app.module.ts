import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { CategoryModule } from './category/category.module';
import { FileModule } from './file/file.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MailerModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    PrismaModule,
    FileModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
