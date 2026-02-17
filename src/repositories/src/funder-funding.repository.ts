import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { FunderFunding } from 'src/models/funding-funder.model';

@Injectable()
export class FunderFundingRepository extends BaseRepository<FunderFunding> {
  constructor(dataSource: DataSource) {
    super(dataSource, FunderFunding);
  }

  async deleteByFundingId(fundingId: string): Promise<number> {
    const result = await this.repository.delete({
      funding: { id: fundingId },
    });

    return result.affected ?? 0;
  }
}
