import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/infrastructure/models/auth/user.model';
import { EmailVerificationToken } from 'src/infrastructure/models/auth/email-verification-token.model';
import { PasswordResetToken } from 'src/infrastructure/models/auth/password-reset-token.model';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    private readonly userRoleDataSource: DataSource,
    private readonly passwordResetTokenDataSource: DataSource,
    private readonly emailVerificationTokenDataSource: DataSource,
    private readonly roleDataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  createEmailVerficationToken(
    user: User,
    token: string,
  ): Promise<EmailVerificationToken> {
    const emailToken = this.emailVerificationTokenDataSource.getRepository(
      EmailVerificationToken,
    );
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const newEmailToken = emailToken.create({ user, token, expiresAt });
    return emailToken.save(newEmailToken);
  }

  createPasswordResetToken(
    user: User,
    token: string,
  ): Promise<PasswordResetToken> {
    const emailToken =
      this.passwordResetTokenDataSource.getRepository(PasswordResetToken);

    const newToken = emailToken.create({
      user,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    return emailToken.save(newToken);
  }

  async markPasswordResetTokenAsUsed(token: string): Promise<void> {
    const passwordTokenRepo =
      this.passwordResetTokenDataSource.getRepository(PasswordResetToken);

    const resetToken = await passwordTokenRepo.findOne({
      where: { token },
    });

    if (!resetToken) {
      throw new Error('Invalid token');
    }

    if (resetToken.used) {
      throw new Error('Token already used');
    }

    resetToken.used = true;

    await passwordTokenRepo.save(resetToken);
  }

  async verifyEmailToken(token: string): Promise<User> {
    const emailTokenRepo = this.emailVerificationTokenDataSource.getRepository(
      EmailVerificationToken,
    );

    const emailToken = await emailTokenRepo.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!emailToken) {
      throw new Error('Invalid token');
    }

    if (emailToken.used) {
      throw new Error('Token already used');
    }

    if (emailToken.expiresAt < new Date()) {
      throw new Error('Token expired');
    }

    emailToken.used = true;
    await emailTokenRepo.save(emailToken);

    emailToken.user.isEmailConfirmed = true;
    await this.save(emailToken.user);

    return emailToken.user;
  }

  async verifyPasswordResetToken(token: string): Promise<User> {
    const passwordTokenRepo =
      this.passwordResetTokenDataSource.getRepository(PasswordResetToken);

    const resetToken = await passwordTokenRepo.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new Error('Invalid token');
    }

    if (resetToken.used) {
      throw new Error('Token already used');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new Error('Token expired');
    }

    return resetToken.user;
  }

  async createAdminIfNone() {
    const count = await this.count();
    if (count === 0) {
      const admin = this.create({
        email: 'admin@example.com',
        password: 'admin123',
        isEmailConfirmed: true,
      });
      await this.save(admin);
      return admin;
    }
    return null;
  }
}
