import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ActivityController,
  FundingActivityController,
} from 'src/presentation/controller/src/activity.controller';
import { Activity } from 'src/infrastructure/models/activity.model';
import { ActivityFunding } from 'src/infrastructure/models/activity-funding.model';
import { ActivityRepository } from 'src/infrastructure/repositories/src/activity.repository';
import { ActivityFundingRepository } from 'src/infrastructure/repositories/src/activity-funding.repository';
import { FundingRepository } from 'src/infrastructure/repositories/src/funding.repository';
import { ActivityService } from 'src/application/services/src/activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, ActivityFunding])],
  controllers: [ActivityController, FundingActivityController],
  providers: [
    ActivityRepository,
    ActivityFundingRepository,
    FundingRepository,
    ActivityService,
  ],
  exports: [ActivityRepository, ActivityService],
})
export class ActivityModule {}
