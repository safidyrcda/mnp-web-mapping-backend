import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { AuthRepository } from 'src/infrastructure/repositories/src/auth/auth.repository';
import { UserRepository } from 'src/infrastructure/repositories/src/user.repository';
import { MailService } from 'src/utils/mail/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(email: string, password: string) {
    const exists = await this.userRepository.findByEmail(email);
    if (exists) throw new BadRequestException('Email already registered');

    const user = this.userRepository.create({ email, password });
    await this.userRepository.save(user);

    const token = randomBytes(32).toString('hex');

    this.authRepository.createEmailVerficationToken(user, token);

    await this.mailService.sendEmailConfirmation(email, token);

    return { message: 'User created. Please confirm your email.' };
  }

  async login(email: string, password: string) {
    console.log(email, password);
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const valid = await user.checkPassword(password);
    if (!valid) throw new BadRequestException('Invalid credentials');

    if (!user.isEmailConfirmed)
      throw new BadRequestException('Email not confirmed');

    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async confirmEmail(token: string) {
    try {
      await this.authRepository.verifyEmailToken(token);

      return { message: 'Email confirmed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const token = randomBytes(32).toString('hex');

    const resetToken = this.authRepository.createPasswordResetToken(
      user,
      token,
    );

    resetToken.expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

    await this.userRepository.manager.save(resetToken);

    await this.mailService.sendForgotPassword(email, token);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await this.authRepository.verifyPasswordResetToken(token);

      const password = await bcrypt.hash(newPassword, 10);

      user.password = password;

      await this.userRepository.save(user);

      await this.authRepository.markPasswordResetTokenAsUsed(token);

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
