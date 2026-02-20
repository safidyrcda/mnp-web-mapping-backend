import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'mail.parcs-madagascar.com',
      port: 587,
      auth: {
        user: 'no-reply@parcs-madagascar.com',
        pass: 'zLhTKaJ5tNwjQeQ7dW3b',
      },
      secure: false,
      dkim: {
        domainName: 'parcs-madagascar.com',
        keySelector: 'mail',
        privateKey:
          'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArxsVNCGYOwEvVbG1QDEHDShnio22pFAZw97bMNxMaykTI6panzKLUZ9B648NN70H5IYiIYgvSl7r0c4fDs/RBZb6PNlsmrAWv1VWMKK3hTc/PK/lsHsAs2rkgjEsoExRUFM2s3Z10obrbaRYQew5/s35iyqMUkJQYdayX5vim7BT5hHLCKkSUtT0udDLxDA+1INIIXl+3ep8CPZ8WhYX8PL411b0WPdicU5LNrZc8Tt9Jlk+V7CMaZsiYcwdG/990X1qnRCJnn/nW3oPGahF1aULHH/O3H9hMUr5CeU8+uWmtsgclJ9RBmHhtZAQwLvtf4AhYp5+W0OS9nKNWqbStwIDAQAB', // clé privée correspondante
      },
    });
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
