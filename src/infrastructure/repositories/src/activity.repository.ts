// src/infrastructure/repositories/src/activity.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Activity } from 'src/infrastructure/models/activity.model';
import { ActivityFunding } from 'src/infrastructure/models/activity-funding.model';

@Injectable()
export class ActivityRepository extends BaseRepository<Activity> {
  constructor(dataSource: DataSource) {
    super(dataSource, Activity);
  }

  // Toutes les activités liées à un funding donné (via table de jointure)
  async findByFundingId(fundingId: string): Promise<Activity[]> {
    return this.dataSource
      .getRepository(Activity)
      .createQueryBuilder('activity')
      .innerJoin('activity.activityFundings', 'af')
      .innerJoin('af.funding', 'funding')
      .where('funding.id = :fundingId', { fundingId })
      .orderBy('activity.createdAt', 'ASC')
      .getMany();
  }

  // Tous les financements liés à une activité donnée
  async findFundingsByActivityId(
    activityId: string,
  ): Promise<ActivityFunding[]> {
    return this.dataSource.getRepository(ActivityFunding).find({
      where: { activity: { id: activityId } },
      relations: { funding: true },
    });
  }
}
