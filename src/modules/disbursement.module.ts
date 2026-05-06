import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disbursement } from 'src/infrastructure/models/disbursement.model';
import { DisbursementRepository } from 'src/infrastructure/repositories/src/disbursement.repository';
import { DisbursementService } from 'src/application/services/src/disbursement.service';
import { DisbursementController } from 'src/presentation/controller/src/disbursement.controller';
import { FundingRepository } from 'src/infrastructure/repositories/src/funding.repository';
import { Funding } from 'src/infrastructure/models/funding.model';

@Module({
  imports: [TypeOrmModule.forFeature([Disbursement, Funding])],
  providers: [DisbursementRepository, DisbursementService, FundingRepository],
  controllers: [DisbursementController],
  exports: [DisbursementRepository, DisbursementService],
})
export class DisbursementModule {}
