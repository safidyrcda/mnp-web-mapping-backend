import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database.module';
import { ProtectedAreaModule } from './modules/protected-area.module';
import { FunderModule } from './modules/funder.module';
import { FundingModule } from './modules/funding.module';
import { DisbursementModule } from './modules/disbursement.module';
import { ActivityModule } from './modules/activity.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './modules/project.module';
import { AuthModule } from './modules/auth.module';
import { ProtectedAreaFunderModule } from './modules/protected-area-funder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    ProtectedAreaModule,
    FunderModule,
    FundingModule,
    DisbursementModule,
    ActivityModule,
    ProjectModule,
    AuthModule,
    ProtectedAreaFunderModule,
  ],
  controllers: [],

  providers: [],
})
export class AppModule {}
