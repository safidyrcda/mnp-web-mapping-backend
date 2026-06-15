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

  async updateFunding(
    id: string,
    data: Partial<Funding>,
  ): Promise<Funding | null> {
    const entity = await this.repo.preload({ id, ...data });
    if (!entity) return null;
    return this.repo.save(entity);
  }

  async find(): Promise<Funding[]> {
    return this.repo
      .createQueryBuilder('funding')
      .leftJoinAndSelect('funding.protectedAreaFundings', 'paf')
      .leftJoin('paf.protectedArea', 'pa')
      .addSelect(['pa.id', 'pa.sigle', 'pa.name', 'pa.status', 'pa.size'])
      .leftJoinAndSelect('pa.protectedAreaPartners', 'pap')
      .leftJoinAndSelect('pap.funder', 'partnerFunder') // ← funder, pas partner
      .leftJoinAndSelect('funding.funder', 'ff')
      .addSelect(['ff.id', 'ff.name'])
      .leftJoinAndSelect('funding.project', 'project')
      .leftJoinAndSelect('funding.disbursements', 'disbursements')
      .leftJoinAndSelect('funding.activityFundings', 'af')
      .leftJoinAndSelect('af.activity', 'activity')
      .orderBy('funding.createdAt', 'ASC')
      .getMany();
  }
  async findAllWithFunders(): Promise<Funding[]> {
    return this.repo.find({});
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
      relations: { funder: true },
    });
  }
}
