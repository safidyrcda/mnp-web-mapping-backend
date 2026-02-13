import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundingController } from '../controller/src/funding.controller';
import { Funding } from '../models/funding.model';
import { FundingRepository } from '../repositories/src/funding.repository';
import { FundingService } from '../services/src/funding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Funding])],
  controllers: [FundingController],
  providers: [FundingRepository, FundingService],
  exports: [FundingRepository, FundingService],
})
export class FundingModule {}
