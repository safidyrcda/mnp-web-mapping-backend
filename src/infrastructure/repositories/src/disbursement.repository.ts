// src/infrastructure/repositories/src/disbursement.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Disbursement } from 'src/infrastructure/models/disbursement.model';

@Injectable()
export class DisbursementRepository extends BaseRepository<Disbursement> {
  constructor(dataSource: DataSource) {
    super(dataSource, Disbursement);
  }

  async findByFundingId(fundingId: string): Promise<Disbursement[]> {
    return this.dataSource.getRepository(Disbursement).find({
      where: { funding: { id: fundingId } },
      order: { date: 'DESC' },
    });
  }

  async deleteByFundingId(fundingId: string): Promise<number> {
    const result = await this.repository.delete({ funding: { id: fundingId } });
    return result.affected ?? 0;
  }
}
