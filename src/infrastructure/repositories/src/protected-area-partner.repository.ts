import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ProtectedAreaPartner,
  PartnerType,
} from 'src/infrastructure/models/protected-area-partner.model';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { Funder } from 'src/infrastructure/models/funder.model';

@Injectable()
export class ProtectedAreaPartnerRepository {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository(ProtectedAreaPartner);
  }

  async create(data: {
    protectedArea: ProtectedArea;
    funder: Funder;
    type: PartnerType;
  }): Promise<ProtectedAreaPartner> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(
    id: string,
    data: Partial<ProtectedAreaPartner>,
  ): Promise<ProtectedAreaPartner | null> {
    await this.repo.update({ id }, data);
    return this.repo.findOne({
      where: { id },
      relations: { funder: true, protectedArea: true },
    });
  }

  async findByProtectedAreaAndFunder(
    protectedAreaId: string,
    funderId: string,
  ): Promise<ProtectedAreaPartner | null> {
    return this.repo.findOne({
      where: {
        protectedArea: { id: protectedAreaId },
        funder: { id: funderId },
      },
      relations: { funder: true, protectedArea: true },
    });
  }

  async findByProtectedArea(
    protectedAreaId: string,
  ): Promise<ProtectedAreaPartner[]> {
    return this.repo.find({
      where: { protectedArea: { id: protectedAreaId } },
      relations: { funder: true },
    });
  }

  async findById(id: string): Promise<ProtectedAreaPartner | null> {
    return this.repo.findOne({
      where: { id },
      relations: { funder: true, protectedArea: true },
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async upsertForProtectedArea(
    protectedAreaId: string,
    entries: { funderId: string; type: PartnerType }[],
  ): Promise<ProtectedAreaPartner[]> {
    const existing = await this.findByProtectedArea(protectedAreaId);
    const result: ProtectedAreaPartner[] = [];

    for (const entry of entries) {
      const found = existing.find((e) => e.funder?.id === entry.funderId);
      if (found) {
        found.type = entry.type;
        result.push(await this.repo.save(found));
      } else {
        const entity = this.repo.create({
          protectedArea: { id: protectedAreaId } as ProtectedArea,
          funder: { id: entry.funderId } as Funder,
          type: entry.type,
        });
        result.push(await this.repo.save(entity));
      }
    }

    const newFunderIds = entries.map((e) => e.funderId);
    const toRemove = existing.filter(
      (e) => !newFunderIds.includes(e.funder?.id ?? ''),
    );
    if (toRemove.length > 0) {
      await this.repo.remove(toRemove);
    }

    return result;
  }
}
