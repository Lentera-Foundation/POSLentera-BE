import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TEmail } from 'src/libs/entities';

@Injectable()
export class MailerService {
  constructor() {}
  mailTransport() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
    return transporter;
  }

  async sendMail(data: TEmail) {
    const { email, subject, html } = data;

    const transporter = this.mailTransport();

    const info = await transporter.sendMail({
      to: email,
      subject,
      html,
    });
    return info;
  }
}
