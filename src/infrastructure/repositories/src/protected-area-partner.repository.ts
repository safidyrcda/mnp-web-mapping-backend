import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { ProtectedAreaPartner } from 'src/infrastructure/models/protected-area-partner.model';

@Injectable()
export class ProtectedAreaPartnerRepository extends BaseRepository<ProtectedAreaPartner> {
  constructor(dataSource: DataSource) {
    super(dataSource, ProtectedAreaPartner);
  }

  private get repo() {
    return this.dataSource.getRepository(ProtectedAreaPartner);
  }

  async findByProtectedAreaId(protectedAreaId: string) {
    return this.repo.find({
      where: { protectedArea: { id: protectedAreaId } },
      relations: { partner: true },
    });
  }

  async findByPartnerId(partnerId: string) {
    return this.repo.find({
      where: { partner: { id: partnerId } },
      relations: { protectedArea: true },
    });
  }

  async deleteByProtectedAreaId(protectedAreaId: string) {
    return this.repo.delete({ protectedArea: { id: protectedAreaId } });
  }
}
