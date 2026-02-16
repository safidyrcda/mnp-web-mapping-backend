import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CSVColumnsType, parseCsvFile } from './csv-seeder';
import { ProtectedArea } from 'src/models/protected-area.model';
import { ProtectedAreaRepository } from 'src/repositories/src/protected-area.repository';
import { NOTFOUND } from 'dns';
import { FundingRepository } from 'src/repositories/src/funding.repository';
import { FunderRepository } from 'src/repositories/src/funder.repository';
import { Funder } from 'src/models/funder.model';
import { Funding } from 'src/models/funding.model';

@Injectable()
export class SeedService {
  constructor(
    private readonly protectedAreaRepository: ProtectedAreaRepository,
    private readonly fundingRepository: FundingRepository,
    private readonly funderRepository: FunderRepository,
  ) {}

  private async updateProtectedArea(data: {
    sigle: string;
    name: string;
    status: string;
  }): Promise<ProtectedArea | null> {
    const res = await this.protectedAreaRepository.findOneBySigle(data.sigle);

    if (!res) {
      throw new HttpException('AP not found', HttpStatus.NOT_FOUND);
    }

    return await this.protectedAreaRepository.update(res.id, {
      name: data.name,
      status: data.status,
    });
  }

  private async updateOrCreateFunder(name: string): Promise<Funder | null> {
    const res = await this.funderRepository.findOneByName(name);

    if (!res) {
      return this.funderRepository.create({ name: name });
    }

    return res;
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;

    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  private parseAmount(amountStr: string): number {
    if (!amountStr) return 0;

    // enlever espaces et remplacer virgule par point
    const clean = amountStr.replace(/\s/g, '').replace(',', '.');
    return parseFloat(clean);
  }
  private async createFunding(data: Partial<Funding>) {
    return this.fundingRepository.create(data);
  }

  async run() {
    const res: CSVColumnsType[] = await parseCsvFile('mnp_fundings.csv');

    for (const row of res) {
      const protectedArea = await this.updateProtectedArea({
        sigle: row.sigle,
        name: row.ap_name,
        status: row.status,
      });
      if (!protectedArea) {
        throw new HttpException('AP not found', HttpStatus.NOT_FOUND);
      }

      const funder = await this.updateOrCreateFunder(row.funder);

      if (!funder) {
        throw new HttpException('Funder not found', HttpStatus.NOT_FOUND);
      }

      const debut = this.parseDate(row.debut);
      const end = this.parseDate(row.end);
      const amount = this.parseAmount(row.amount);

      const newFunding: Partial<Funding> = {
        name: row.name,
        amount: amount,
        funder: funder,
        protectedArea: protectedArea,
      };

      if (debut) {
        newFunding.debut = debut;
      }

      if (end) {
        newFunding.end = end;
      }

      if (amount === 0) newFunding.amount = undefined;
      if (row.currency) newFunding.currency = row.currency;
      await this.createFunding(newFunding);
    }
  }
}
