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
import { ProtectedAreaFunding } from 'src/infrastructure/models/protected-area-funding.model';
import { ProtectedAreaFundingRepository } from 'src/infrastructure/repositories/src/protected-area-funding.repository';
import { Disbursement } from 'src/infrastructure/models/disbursement.model';
import { DisbursementRepository } from 'src/infrastructure/repositories/src/disbursement.repository';
import { ActivityRepository } from 'src/infrastructure/repositories/src/activity.repository';
import { Activity } from 'src/infrastructure/models/activity.model';
import { ActivityFunding } from 'src/infrastructure/models/activity-funding.model';
import { ActivityFundingRepository } from 'src/infrastructure/repositories/src/activity-funding.repository';
import { ProtectedAreaPartnerRepository } from 'src/infrastructure/repositories/src/protected-area-partner.repository';
import { ProtectedAreaPartnerController } from 'src/presentation/controller/src/protected-area-partner.controller';
import { ProtectedAreaPartner } from 'src/infrastructure/models/protected-area-partner.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Funding,
      Funder,
      ProtectedArea,
      Project,
      FunderFunding,
      ProtectedAreaFunding,
      Disbursement,
      Activity,
      ActivityFunding,
      ProtectedAreaPartner,
    ]),
  ],
  controllers: [FundingController, ProtectedAreaPartnerController],
  providers: [
    FundingService,
    FundingRepository,
    FunderRepository,
    ProjectRepository,
    ProtectedAreaRepository,
    ProtectedAreaFundingRepository,
    ProtectedAreaPartnerRepository,
    ActivityRepository,
    ActivityFundingRepository,
    DisbursementRepository,
  ],
  exports: [FundingRepository, FundingService],
})
export class FundingModule {}
