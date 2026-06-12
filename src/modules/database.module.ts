import { Global, Module } from '@nestjs/common';

import { ProtectedArea } from '../infrastructure/models/protected-area.model';
import { Funder } from 'src/infrastructure/models/funder.model';
import { Funding } from 'src/infrastructure/models/funding.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Project } from 'src/infrastructure/models/project.model';
import { Activity } from 'src/infrastructure/models/activity.model';
import { ActivityFunding } from 'src/infrastructure/models/activity-funding.model';
import { Disbursement } from 'src/infrastructure/models/disbursement.model';
import { FunderFunding } from 'src/infrastructure/models/funding-funder.model';
import { User } from 'src/infrastructure/models/auth/user.model';
import { UserRole } from 'src/infrastructure/models/auth/user-role.model';
import { Role } from 'src/infrastructure/models/auth/role.model';
import { PasswordResetToken } from 'src/infrastructure/models/auth/password-reset-token.model';
import { EmailVerificationToken } from 'src/infrastructure/models/auth/email-verification-token.model';
import { ProtectedAreaFunding } from 'src/infrastructure/models/protected-area-funding.model';
import { ProtectedAreaFunder } from 'src/infrastructure/models/protected-area-funder';
import { Partner } from 'src/infrastructure/models/partner.model';
import { ProtectedAreaPartner } from 'src/infrastructure/models/protected-area-partner.model';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_LISTEN_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        schema: 'public',
        uuidExtension: 'pgcrypto',
        entities: [
          Funder,
          Funding,
          ProtectedArea,
          Project,
          Activity,
          ActivityFunding,
          ProtectedAreaFunding,
          Disbursement,
          FunderFunding,
          User,
          UserRole,
          Role,
          PasswordResetToken,
          EmailVerificationToken,
          ProtectedAreaFunder,
          Partner,
          ProtectedAreaPartner,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
