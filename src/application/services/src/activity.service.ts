import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Activity } from 'src/infrastructure/models/activity.model';
import { ActivityRepository } from 'src/infrastructure/repositories/src/activity.repository';
import { ActivityFundingRepository } from 'src/infrastructure/repositories/src/activity-funding.repository';
import { FundingRepository } from 'src/infrastructure/repositories/src/funding.repository';

@Injectable()
export class ActivityService extends BaseService<Activity> {
  constructor(
    protected repository: ActivityRepository,
    private activityFundingRepository: ActivityFundingRepository,
    private fundingRepository: FundingRepository,
  ) {
    super(repository);
  }

  // Toutes les activités liées à un funding
  findByFunding(fundingId: string): Promise<Activity[]> {
    return this.repository.findByFundingId(fundingId);
  }

  create(data: Partial<Activity>): Promise<Activity> {
    return this.repository.create(data);
  }

  // Tous les financements liés à une activité
  async findFundingsByActivity(activityId: string) {
    const afs = await this.repository.findFundingsByActivityId(activityId);
    return afs.map((af) => af.funding!);
  }

  // Créer une activité standalone puis la lier à un funding
  async createAndLink(
    dto: { title: string; description?: string },
    fundingId: string,
  ): Promise<Activity> {
    const funding = await this.fundingRepository.findById(fundingId);
    if (!funding)
      throw new Error(`Funding with ID ${fundingId} does not exist.`);
    const activity = await this.repository.create(dto);
    await this.activityFundingRepository.create({ activity, funding });
    return activity;
  }

  // Lier une activité existante à un funding (sans la recréer)
  async linkToFunding(activityId: string, fundingId: string): Promise<void> {
    const activity = await this.repository.findById(activityId);
    if (!activity)
      throw new Error(`Activity with ID ${activityId} does not exist.`);
    const funding = await this.fundingRepository.findById(fundingId);
    if (!funding)
      throw new Error(`Funding with ID ${fundingId} does not exist.`);

    const existing =
      await this.activityFundingRepository.findByFundingAndActivity(
        fundingId,
        activityId,
      );
    if (!existing) {
      await this.activityFundingRepository.create({ activity, funding });
    }
  }

  // Délier une activité d'un funding (sans supprimer l'activité elle-même)
  async unlinkFromFunding(
    activityId: string,
    fundingId: string,
  ): Promise<void> {
    const af = await this.activityFundingRepository.findByFundingAndActivity(
      fundingId,
      activityId,
    );
    if (af?.id) {
      await this.activityFundingRepository.delete(af.id);
    }
  }
}
