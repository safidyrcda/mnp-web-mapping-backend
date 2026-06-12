import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Partner } from 'src/infrastructure/models/partner.model';
import { PartnerRepository } from 'src/infrastructure/repositories/src/partner.repository';

@Injectable()
export class PartnerService extends BaseService<Partner> {
  constructor(protected repository: PartnerRepository) {
    super(repository);
  }

  async create(data: Partial<Partner>): Promise<Partner> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Partner>): Promise<Partner | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...data };
    return this.repository.update(id, updated);
  }

  async findAll(): Promise<Partner[]> {
    return this.repository.find();
  }
}
