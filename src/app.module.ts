import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pool } from 'pg';
import { DatabaseModule } from './modules/database.module';
import { ProtectedAreaModule } from './modules/protected-area.module';
import { FunderModule } from './modules/funder.module';
import { FundingModule } from './modules/funding.module';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [],

  providers: [],
})
export class AppModule {}
