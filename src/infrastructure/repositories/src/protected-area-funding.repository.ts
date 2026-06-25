import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProtectedAreaFunding } from 'src/infrastructure/models/protected-area-funding.model';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { Funding } from 'src/infrastructure/models/funding.model';

@Injectable()
export class ProtectedAreaFundingRepository {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository(ProtectedAreaFunding);
  }

  async create(data: {
    protectedArea: ProtectedArea;
    funding: Funding;
    amount?: number;
    currency?: string;
    amountInEuro?: number;
  }): Promise<ProtectedAreaFunding> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findByFundingId(fundingId: string): Promise<ProtectedAreaFunding[]> {
    return this.repo.find({
      where: { funding: { id: fundingId } },
      relations: { protectedArea: true },
    });
  }

  async deleteByFundingId(fundingId: string): Promise<void> {
    await this.repo.delete({ funding: { id: fundingId } });
  }

  async deleteById(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async upsertForFunding(
    fundingId: string,
    entries: {
      protectedAreaId: string;
      amount?: number;
      currency?: string;
      amountInEuro?: number;
    }[],
  ): Promise<ProtectedAreaFunding[]> {
    const existing = await this.findByFundingId(fundingId);

    const result: ProtectedAreaFunding[] = [];

    for (const entry of entries) {
      const found = existing.find(
        (e) => e.protectedArea?.id === entry.protectedAreaId,
      );

      if (found) {
        found.amount = entry.amount;
        found.currency = entry.currency;
        found.amountInEuro = entry.amountInEuro;
        result.push(await this.repo.save(found));
      } else {
        const entity = this.repo.create({
          funding: { id: fundingId } as Funding,
          protectedArea: { id: entry.protectedAreaId } as ProtectedArea,
          amount: entry.amount,
          currency: entry.currency,
          amountInEuro: entry.amountInEuro,
        });
        result.push(await this.repo.save(entity));
      }
    }

    // Supprimer les entrées qui ne sont plus dans la liste
    const newIds = entries.map((e) => e.protectedAreaId);
    const toRemove = existing.filter(
      (e) => !newIds.includes(e.protectedArea?.id ?? ''),
    );
    if (toRemove.length > 0) {
      await this.repo.remove(toRemove);
    }

    return result;
  }
}
