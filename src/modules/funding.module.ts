import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundingController } from '../presentation/controller/src/funding.controller';
import { Funding } from '../infrastructure/models/funding.model';
import { FundingRepository } from '../infrastructure/repositories/src/funding.repository';
import { FundingService } from '../application/services/src/funding.service';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { Funder } from 'src/infrastructure/models/funder.model';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { Project } from 'src/infrastructure/models/project.model';
import { ProjectRepository } from 'src/infrastructure/repositories/src/project.repository';
import { FunderFunding } from 'src/infrastructure/models/funding-funder.model';
import { FunderFundingRepository } from 'src/infrastructure/repositories/src/funder-funding.repository';

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
