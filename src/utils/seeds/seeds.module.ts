import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seeds.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/modules/database.module';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { Funder } from 'src/infrastructure/models/funder.model';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';
import { Funding } from 'src/infrastructure/models/funding.model';
import { FundingRepository } from 'src/infrastructure/repositories/src/funding.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([ProtectedArea, Funder, Funding]),
  ],
  providers: [
    ProtectedAreaRepository,
    FunderRepository,
    FundingRepository,
    SeedService,
  ],
  exports: [SeedService],
})
export class SeedModule {}
