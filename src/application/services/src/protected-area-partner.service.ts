import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProtectedAreaPartner,
  PartnerType,
} from 'src/infrastructure/models/protected-area-partner.model';
import { ProtectedAreaPartnerRepository } from 'src/infrastructure/repositories/src/protected-area-partner.repository';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';
import { CreateProtectedAreaPartnerDto } from 'src/presentation/dtos/protected-area-partner/create-protected-area-partner.dto';
import { UpdateProtectedAreaPartnerDto } from 'src/presentation/dtos/protected-area-partner/update-protected-area-partner.dto';

export interface UpsertPartnerEntry {
  funderId: string;
  type: PartnerType;
}

@Injectable()
export class ProtectedAreaPartnerService {
  constructor(
    private readonly repository: ProtectedAreaPartnerRepository,
    private readonly protectedAreaRepository: ProtectedAreaRepository,
    private readonly funderRepository: FunderRepository,
  ) {}

  async findByProtectedArea(protectedAreaId: string) {
    return this.repository.findByProtectedArea(protectedAreaId);
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async create(
    data: CreateProtectedAreaPartnerDto,
  ): Promise<ProtectedAreaPartner> {
    const protectedArea = await this.protectedAreaRepository.findById(
      data.protectedAreaId,
    );
    if (!protectedArea) {
      throw new NotFoundException(
        `Protected Area with ID ${data.protectedAreaId} does not exist.`,
      );
    }

    const funder = await this.funderRepository.findById(data.partnerId);
    if (!funder) {
      throw new NotFoundException(
        `Funder with ID ${data.partnerId} does not exist.`,
      );
    }

    return this.repository.create({
      protectedArea,
      funder,
      type: data.type,
    });
  }

  async update(
    id: string,
    data: UpdateProtectedAreaPartnerDto,
  ): Promise<ProtectedAreaPartner> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `ProtectedAreaPartner with ID ${id} does not exist.`,
      );
    }

    if (data.partnerId !== undefined) {
      const funder = await this.funderRepository.findById(data.partnerId);
      if (!funder) {
        throw new NotFoundException(
          `Funder with ID ${data.partnerId} does not exist.`,
        );
      }
      existing.funder = funder;
    }

    if (data.type !== undefined) existing.type = data.type;

    const updated = await this.repository.update(id, existing);
    if (!updated) {
      throw new NotFoundException(
        `ProtectedAreaPartner with ID ${id} could not be updated.`,
      );
    }

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Remplace toutes les liaisons Funder/partenaire pour une AP donnée (upsert complet)
   */
  async upsertForProtectedArea(
    protectedAreaId: string,
    entries: UpsertPartnerEntry[],
  ) {
    const protectedArea =
      await this.protectedAreaRepository.findById(protectedAreaId);
    if (!protectedArea) {
      throw new NotFoundException(
        `Protected Area with ID ${protectedAreaId} does not exist.`,
      );
    }

    return this.repository.upsertForProtectedArea(protectedAreaId, entries);
  }
}
