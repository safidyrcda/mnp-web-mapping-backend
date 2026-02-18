import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Funding } from 'src/models/funding.model';

@Injectable()
export class FundingRepository extends BaseRepository<Funding> {
  constructor(dataSource: DataSource) {
    super(dataSource, Funding);
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
        funderFundings: {
          funder: true,
        },
      },
    });

    return res;
  }
}
