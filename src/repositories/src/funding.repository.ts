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
        funder: true,
        project: true,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        debut: true,
        end: true,
        currency: true,
        funder: {
          id: true,
          name: true,
        },

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
      },
    });
  }

  findByAPId(protectedAreaId: string): Promise<Funding[]> {
    return this.dataSource.getRepository(Funding).find({
      where: { protectedArea: { id: protectedAreaId } },
      relations: ['protectedArea', 'funder'],
    });
  }
}
