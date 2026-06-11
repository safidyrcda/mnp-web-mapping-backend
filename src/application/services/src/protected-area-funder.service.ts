import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';

import { ProtectedAreaFunderRepository } from 'src/infrastructure/repositories/src/protected-area-funder.repository';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';
import { CreateProtectedAreaFunderDto } from 'src/presentation/dtos/protected-area-funder/create-protected-area-funder.dto';
import { UpdateProtectedAreaFunderDto } from 'src/presentation/dtos/protected-area-funder/update-protected-area-funder.dto';
import {
  ProtectedAreaFunder,
  ProtectedAreaFunderType,
} from 'src/infrastructure/models/protected-area-funder';

export interface UpsertEntry {
  funderId: string;
  type?: ProtectedAreaFunderType;
}

@Injectable()
export class ProtectedAreaFunderService extends BaseService<ProtectedAreaFunder> {
  constructor(
    protected repository: ProtectedAreaFunderRepository,
    private protectedAreaRepository: ProtectedAreaRepository,
    private funderRepository: FunderRepository,
  ) {
    super(repository);
  }

  async findByProtectedArea(protectedAreaId: string) {
    return this.repository.findByProtectedAreaId(protectedAreaId);
  }

  async findByFunder(funderId: string) {
    return this.repository.findByFunderId(funderId);
  }

  async create(
    data: CreateProtectedAreaFunderDto,
  ): Promise<ProtectedAreaFunder> {
    const protectedArea = await this.protectedAreaRepository.findById(
      data.protectedAreaId,
    );
    if (!protectedArea)
      throw new Error(
        `Protected Area with ID ${data.protectedAreaId} does not exist.`,
      );

    const funder = await this.funderRepository.findById(data.funderId);
    if (!funder)
      throw new Error(`Funder with ID ${data.funderId} does not exist.`);

    return this.repository.create({
      protectedArea,
      funder,
      type: data.type,
    });
  }

  async update(
    id: string,
    data: UpdateProtectedAreaFunderDto,
  ): Promise<ProtectedAreaFunder> {
    const existing = await this.repository.findById(id);
    if (!existing)
      throw new Error(`ProtectedAreaFunder with ID ${id} does not exist.`);

    if (data.funderId !== undefined) {
      const funder = await this.funderRepository.findById(data.funderId);
      if (!funder)
        throw new Error(`Funder with ID ${data.funderId} does not exist.`);
      existing.funder = funder;
    }

    if (data.type !== undefined) existing.type = data.type;

    const updated = await this.repository.update(id, existing);
    if (!updated)
      throw new Error(
        `ProtectedAreaFunder with ID ${id} could not be updated.`,
      );

    return updated;
  }

  /**
   * Remplace toutes les liaisons Funder pour une AP donnée (upsert complet)
   */
  async upsertForProtectedArea(
    protectedAreaId: string,
    entries: UpsertEntry[],
  ) {
    const protectedArea =
      await this.protectedAreaRepository.findById(protectedAreaId);
    if (!protectedArea)
      throw new Error(
        `Protected Area with ID ${protectedAreaId} does not exist.`,
      );

    await this.repository.deleteByProtectedAreaId(protectedAreaId);

    for (const entry of entries) {
      const funder = await this.funderRepository.findById(entry.funderId);
      if (!funder)
        throw new Error(`Funder with ID ${entry.funderId} does not exist.`);

      await this.repository.create({
        protectedArea,
        funder,
        type: entry.type,
      });
    }

    return this.repository.findByProtectedAreaId(protectedAreaId);
  }
}
