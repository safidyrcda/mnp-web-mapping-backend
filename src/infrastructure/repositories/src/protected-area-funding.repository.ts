// src/infrastructure/repositories/src/protected-area-funding.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { ProtectedAreaFunding } from 'src/infrastructure/models/protected-area-funding.model';

@Injectable()
export class ProtectedAreaFundingRepository extends BaseRepository<ProtectedAreaFunding> {
  constructor(dataSource: DataSource) {
    super(dataSource, ProtectedAreaFunding);
  }

  async deleteByFundingId(fundingId: string): Promise<number> {
    const result = await this.repository.delete({ funding: { id: fundingId } });
    return result.affected ?? 0;
  }

  async findByFundingId(fundingId: string) {
    return this.repository.find({
      where: { funding: { id: fundingId } },
      relations: ['protectedArea'],
    });
  }
}
