import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/application/services/src/auth.service';
import { EmailVerificationToken } from 'src/infrastructure/models/auth/email-verification-token.model';
import { PasswordResetToken } from 'src/infrastructure/models/auth/password-reset-token.model';
import { Role } from 'src/infrastructure/models/auth/role.model';
import { UserRole } from 'src/infrastructure/models/auth/user-role.model';
import { User } from 'src/infrastructure/models/auth/user.model';
import { UserRepository } from 'src/infrastructure/repositories/src/user.repository';
import { AuthController } from 'src/presentation/controller/src/auth.controller';
import { MailService } from 'src/utils/mail/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole,
      UserRole,
      Role,
      PasswordResetToken,
      EmailVerificationToken,
    ]),
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UserRepository, MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
