// src/infrastructure/repositories/src/activity-funding.repository.ts  (NOUVELLE)
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { ActivityFunding } from 'src/infrastructure/models/activity-funding.model';

@Injectable()
export class ActivityFundingRepository extends BaseRepository<ActivityFunding> {
  constructor(dataSource: DataSource) {
    super(dataSource, ActivityFunding);
  }

  async deleteByFundingId(fundingId: string): Promise<number> {
    const result = await this.repository.delete({ funding: { id: fundingId } });
    return result.affected ?? 0;
  }

  async deleteByActivityId(activityId: string): Promise<number> {
    const result = await this.repository.delete({
      activity: { id: activityId },
    });
    return result.affected ?? 0;
  }

  async findByFundingAndActivity(
    fundingId: string,
    activityId: string,
  ): Promise<ActivityFunding | null> {
    return this.repository.findOne({
      where: { funding: { id: fundingId }, activity: { id: activityId } },
    });
  }
}
