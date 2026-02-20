import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database.module';
import { ProtectedAreaModule } from './modules/protected-area.module';
import { FunderModule } from './modules/funder.module';
import { FundingModule } from './modules/funding.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './modules/project.module';
import { AuthModule } from './modules/auth.module';

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
    ProjectModule,
    AuthModule,
  ],
  controllers: [],

  providers: [],
})
export class AppModule {}
