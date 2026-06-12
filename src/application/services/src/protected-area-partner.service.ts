import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import {
  ProtectedAreaPartner,
  PartnerType,
} from 'src/infrastructure/models/protected-area-partner.model';
import { ProtectedAreaPartnerRepository } from 'src/infrastructure/repositories/src/protected-area-partner.repository';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { PartnerRepository } from 'src/infrastructure/repositories/src/partner.repository';
import { CreateProtectedAreaPartnerDto } from 'src/presentation/dtos/protected-area-partner/create-protected-area-partner.dto';
import { UpdateProtectedAreaPartnerDto } from 'src/presentation/dtos/protected-area-partner/update-protected-area-partner.dto';

export interface UpsertPartnerEntry {
  partnerId: string;
  type: PartnerType;
}

@Injectable()
export class ProtectedAreaPartnerService extends BaseService<ProtectedAreaPartner> {
  constructor(
    protected repository: ProtectedAreaPartnerRepository,
    private protectedAreaRepository: ProtectedAreaRepository,
    private partnerRepository: PartnerRepository,
  ) {
    super(repository);
  }

  async findByProtectedArea(protectedAreaId: string) {
    return this.repository.findByProtectedAreaId(protectedAreaId);
  }

  async findByPartner(partnerId: string) {
    return this.repository.findByPartnerId(partnerId);
  }

  async create(
    data: CreateProtectedAreaPartnerDto,
  ): Promise<ProtectedAreaPartner> {
    const protectedArea = await this.protectedAreaRepository.findById(
      data.protectedAreaId,
    );
    if (!protectedArea)
      throw new Error(
        `Protected Area with ID ${data.protectedAreaId} does not exist.`,
      );

    const partner = await this.partnerRepository.findById(data.partnerId);
    if (!partner)
      throw new Error(`Partner with ID ${data.partnerId} does not exist.`);

    return this.repository.create({
      protectedArea,
      partner,
      type: data.type,
    });
  }

  async update(
    id: string,
    data: UpdateProtectedAreaPartnerDto,
  ): Promise<ProtectedAreaPartner> {
    const existing = await this.repository.findById(id);
    if (!existing)
      throw new Error(`ProtectedAreaPartner with ID ${id} does not exist.`);

    if (data.partnerId !== undefined) {
      const partner = await this.partnerRepository.findById(data.partnerId);
      if (!partner)
        throw new Error(`Partner with ID ${data.partnerId} does not exist.`);
      existing.partner = partner;
    }

    if (data.type !== undefined) existing.type = data.type;

    const updated = await this.repository.update(id, existing);
    if (!updated)
      throw new Error(
        `ProtectedAreaPartner with ID ${id} could not be updated.`,
      );

    return updated;
  }

  /**
   * Remplace toutes les liaisons Partner pour une AP donnée (upsert complet)
   */
  async upsertForProtectedArea(
    protectedAreaId: string,
    entries: UpsertPartnerEntry[],
  ) {
    const protectedArea =
      await this.protectedAreaRepository.findById(protectedAreaId);
    if (!protectedArea)
      throw new Error(
        `Protected Area with ID ${protectedAreaId} does not exist.`,
      );

    await this.repository.deleteByProtectedAreaId(protectedAreaId);

    for (const entry of entries) {
      const partner = await this.partnerRepository.findById(entry.partnerId);
      if (!partner)
        throw new Error(`Partner with ID ${entry.partnerId} does not exist.`);

      await this.repository.create({
        protectedArea,
        partner,
        type: entry.type,
      });
    }

    return this.repository.findByProtectedAreaId(protectedAreaId);
  }
}
