import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      dkim: {
        domainName: this.configService.get<string>('DKIM_DOMAIN_NAME'),
        keySelector: this.configService.get<string>('DKIM_SELECTOR'),
        privateKey: this.configService.get<string>('DKIM_PRIVATE_KEY'),
      },
    } as nodemailer.TransportOptions);
  }

  async sendEmailConfirmation(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    const url = `${frontendUrl}/auth/verify?token=${token}`;

    await this.transporter.sendMail({
      from: '"No Reply" <no-reply@parcs-madagascar.com>',
      to: email,
      subject: 'Confirm your email',
      html: `
      <p>Hello!</p>
      <p>Please confirm your email by clicking the link below:</p>
      <p><a href="${url}">Confirm Email</a></p>
      <p>Thank you,<br/>Parcs Madagascar Team</p>
    `,
    });
  }

  async sendForgotPassword(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    const url = `${frontendUrl}/auth/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: '"No Reply" <no-reply@parcs-madagascar.com>',
      to: email,
      subject: 'Reset your password',
      html: ` <p>Hello!</p>
      <p>Please reset your password by clicking the link below:</p>
      <p><a href="${url}">Reset Password</a></p>
      <p>Thank you,<br/>Parcs Madagascar Team</p>`,
    });
  }
}
