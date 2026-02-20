import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('EMAIL_HOST'),
      port: configService.get<number>('EMAIL_PORT') || 587,
      secure: false,
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_PASSWORD'),
      },
      dkim: {
        domainName: configService.get<string>('DKIM_DOMAIN_NAME'),
        keySelector: configService.get<string>('DKIM_SELECTOR'),
        privateKey: configService.get<string>('DKIM_PRIVATE_KEY'),
      },
    } as nodemailer.TransportOptions);
  }

  async sendEmailConfirmation(email: string, token: string) {
    await this.transporter.sendMail({
      from: '"No Reply" <no-reply@parcs-madagascar.com>',
      to: email,
      subject: 'Confirm your email',
      html: `
      <p>Hello!</p>
      <p>Please confirm your email by clicking the link below:</p>
      <p><a href="${token}">Confirm Email</a></p>
      <p>Thank you,<br/>Parcs Madagascar Team</p>
    `,
    });
  }

  async sendForgotPassword(email: string, token: string) {
    await this.transporter.sendMail({
      from: '"No Reply" <no-reply@parcs-madagascar.com>',
      to: email,
      subject: 'Reset your password',
      html: `<p>Reset your password with token: <b>${token}</b></p>`,
    });
  }
}
