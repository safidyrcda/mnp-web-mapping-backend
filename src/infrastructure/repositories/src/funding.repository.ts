import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Funding } from 'src/infrastructure/models/funding.model';
import { FunderFunding } from 'src/infrastructure/models/funding-funder.model';

@Injectable()
export class FundingRepository extends BaseRepository<Funding> {
  constructor(
    dataSource: DataSource,
    private readonly funderFundingDataSource: DataSource,
  ) {
    super(dataSource, Funding);
  }

  async find() {
    const res = await this.dataSource.getRepository(Funding).find({
      relations: {
        protectedArea: true,
        funderFundings: {
          funder: true,
        },
      },
      select: {
        id: true,
        name: true,
        amount: true,
        currency: true,
        debut: true,
        end: true,
        protectedArea: {
          id: true,
          name: true,
        },
        funderFundings: {
          id: true,
          funder: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res;
  }

  async findAllWithFunders(): Promise<any[]> {
    return await this.dataSource.getRepository(Funding).find({
      relations: {
        funderFundings: {
          funder: true,
        },
      },
    });
  }

  async findByAPId(protectedAreaId: string) {
    const res = await this.dataSource.getRepository(Funding).find({
      where: { protectedArea: { id: protectedAreaId } },
      relations: {
        protectedArea: true,
        funderFundings: {
          funder: true,
        },
      },
      select: {
        id: true,
        name: true,
        amount: true,
        currency: true,
        debut: true,
        end: true,
        protectedArea: {
          id: true,
          name: true, // ⚡ seulement les champs nécessaires
        },
        funderFundings: {
          id: true,
          funder: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res;
  }

  async findAllFunder(fundingId: string) {
    return await this.funderFundingDataSource
      .getRepository(FunderFunding)
      .find({
        where: {
          funding: {
            id: fundingId,
          },
        },
        relations: {
          funder: true,
        },
      });
  }
}
