import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Funding } from 'src/infrastructure/models/funding.model';
import { FunderFunding } from 'src/infrastructure/models/funding-funder.model';

@Injectable()
export class FundingRepository extends BaseRepository<Funding> {
  constructor(dataSource: DataSource) {
    super(dataSource, Funding);
  }

  private get repo() {
    return this.dataSource.getRepository(Funding);
  }

  private readonly defaultRelations = {
    protectedAreaFundings: { protectedArea: true },
    funderFundings: { funder: true },
    project: true,
    disbursements: true,
    activityFundings: { activity: true }, // many-to-many via jointure
  };

  async find(): Promise<Funding[]> {
    return this.repo.find({
      relations: this.defaultRelations,
      order: { createdAt: 'ASC' },
    });
  }

  async findAllWithFunders(): Promise<Funding[]> {
    return this.repo.find({
      relations: { funderFundings: { funder: true } },
    });
  }

  // Recherche par AP : on passe par la table de jointure ProtectedAreaFunding
  async findByAPId(protectedAreaId: string): Promise<Funding[]> {
    return this.repo
      .createQueryBuilder('funding')
      .innerJoinAndSelect('funding.protectedAreaFundings', 'paf')
      .innerJoinAndSelect('paf.protectedArea', 'pa')
      .leftJoinAndSelect('funding.funderFundings', 'ff')
      .leftJoinAndSelect('ff.funder', 'funder')
      .leftJoinAndSelect('funding.project', 'project')
      .leftJoinAndSelect('funding.disbursements', 'disbursements')
      .leftJoinAndSelect('funding.activityFundings', 'af') // jointure many-to-many
      .leftJoinAndSelect('af.activity', 'activity')
      .where('pa.id = :protectedAreaId', { protectedAreaId })
      .getMany();
  }

  async findAllFunder(fundingId: string): Promise<FunderFunding[]> {
    return this.dataSource.getRepository(FunderFunding).find({
      where: { funding: { id: fundingId } },
      relations: { funder: true },
    });
  }
}
