import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { UserRepository } from 'src/infrastructure/repositories/src/user.repository';
import { MailService } from 'src/utils/mail/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(email: string, password: string) {
    const exists = await this.userRepository.findByEmail(email);
    if (exists) throw new BadRequestException('Email already registered');

    const user = this.userRepository.create({ email, password });
    await this.userRepository.save(user);

    const token = this.jwtService.sign({ email }, { expiresIn: '1d' });
    await this.mailService.sendEmailConfirmation(email, token);

    return { message: 'User created. Please confirm your email.' };
  }

  async login(email: string, password: string) {
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
      const payload: any = this.jwtService.verify(token);
      const user = await this.userRepository.findByEmail(payload.email);
      if (!user) throw new NotFoundException('User not found');

      user.isEmailConfirmed = true;
      await this.userRepository.save(user);
      return { message: 'Email confirmed' };
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const token = randomBytes(32).toString('hex');
    // here you could store the token in DB with expiration, omitted for brevity
    await this.mailService.sendForgotPassword(email, token);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    user.password = newPassword;
    await this.userRepository.save(user);
    return { message: 'Password updated successfully' };
  }
}
