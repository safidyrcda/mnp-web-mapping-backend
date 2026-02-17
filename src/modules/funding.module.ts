import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundingController } from '../controller/src/funding.controller';
import { Funding } from '../models/funding.model';
import { FundingRepository } from '../repositories/src/funding.repository';
import { FundingService } from '../services/src/funding.service';
import { FunderRepository } from 'src/repositories/src/funder.repository';
import { ProtectedAreaRepository } from 'src/repositories/src/protected-area.repository';
import { Funder } from 'src/models/funder.model';
import { ProtectedArea } from 'src/models/protected-area.model';
import { Project } from 'src/models/project.model';
import { ProjectRepository } from 'src/repositories/src/project.repository';
import { FunderFunding } from 'src/models/funding-funder.model';
import { FunderFundingRepository } from 'src/repositories/src/funder-funding.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Funding,
      Funder,
      ProtectedArea,
      Project,
      FunderFunding,
    ]),
  ],
  controllers: [FundingController],
  providers: [
    FundingRepository,
    FunderRepository,
    ProtectedAreaRepository,
    FundingService,
    ProjectRepository,
    FunderFundingRepository,
  ],
  exports: [FundingRepository, FundingService],
})
export class FundingModule {}
