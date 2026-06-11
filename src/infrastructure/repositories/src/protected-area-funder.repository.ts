import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { ProtectedAreaFunder } from 'src/infrastructure/models/protected-area-funder';

@Injectable()
export class ProtectedAreaFunderRepository extends BaseRepository<ProtectedAreaFunder> {
  constructor(dataSource: DataSource) {
    super(dataSource, ProtectedAreaFunder);
  }

  private get repo() {
    return this.dataSource.getRepository(ProtectedAreaFunder);
  }

  async findByProtectedAreaId(protectedAreaId: string) {
    return this.repo.find({
      where: { protectedArea: { id: protectedAreaId } },
      relations: { funder: true },
    });
  }

  async findByFunderId(funderId: string) {
    return this.repo.find({
      where: { funder: { id: funderId } },
      relations: { protectedArea: true },
    });
  }

  async deleteByProtectedAreaId(protectedAreaId: string) {
    return this.repo.delete({ protectedArea: { id: protectedAreaId } });
  }
}
