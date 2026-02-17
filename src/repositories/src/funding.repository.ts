import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Funding } from 'src/models/funding.model';

@Injectable()
export class FundingRepository extends BaseRepository<Funding> {
  constructor(dataSource: DataSource) {
    super(dataSource, Funding);
  }

  find(): Promise<Funding[]> {
    return this.dataSource.getRepository(Funding).find({
      relations: {
        protectedArea: true,
        project: true,
        // on inclut la table de jointure
        funderFunding: {
          funder: true, // inclut le funder réel
        },
      },
      select: {
        id: true,
        name: true,
        amount: true,
        debut: true,
        end: true,
        currency: true,
        protectedArea: {
          id: true,
          name: true,
          sigle: true,
        },
        project: {
          id: true,
          name: true,
          fullname: true,
        },
        funderFunding: {
          funder: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async findAllWithFunders(): Promise<any[]> {
    const fundings = await this.dataSource.getRepository(Funding).find({
      relations: {
        protectedArea: true,
        project: true,
        funderFunding: {
          funder: true,
        },
      },
      select: {
        id: true,
        name: true,
        amount: true,
        debut: true,
        end: true,
        currency: true,
        protectedArea: {
          id: true,
          name: true,
          sigle: true,
        },
        project: {
          id: true,
          name: true,
          fullname: true,
        },
        funderFunding: {
          funder: {
            id: true,
            name: true,
          },
        },
      },
    });

    return fundings.map((f) => ({
      id: f.id,
      name: f.name,
      amount: f.amount,
      debut: f.debut,
      end: f.end,
      currency: f.currency,
      protectedArea: f.protectedArea,
      project: f.project,
      funders: f.funderFunding?.map((ff) => ff.funder) || [],
    }));
  }

  async findByAPId(protectedAreaId: string) {
    const res = await this.dataSource.getRepository(Funding).find({
      where: { protectedArea: { id: protectedAreaId } },
      relations: {
        protectedArea: true,
        project: true,
        funderFunding: {
          funder: true,
        },
      },
      select: {
        id: true,
        name: true,
        amount: true,
        debut: true,
        end: true,
        currency: true,
        protectedArea: {
          id: true,
          name: true,
          sigle: true,
        },
        project: {
          id: true,
          name: true,
          fullname: true,
        },
        funderFunding: {
          funder: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.map((f) => ({
      id: f.id,
      name: f.name,
      amount: f.amount,
      debut: f.debut,
      end: f.end,
      currency: f.currency,
      protectedArea: f.protectedArea,
      project: f.project,
      funders: f.funderFunding?.map((ff) => ff.funder) || [],
    }));
  }
}
