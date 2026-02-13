import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Funding } from 'src/models/funding.model';
import { FundingRepository } from 'src/repositories/src/funding.repository';
import { FunderRepository } from 'src/repositories/src/funder.repository';
import { ProtectedAreaRepository } from 'src/repositories/src/protected-area.repository';

@Injectable()
export class FundingService extends BaseService<Funding> {
  constructor(
    protected repository: FundingRepository,
    private funderRepository: FunderRepository,
    private protectedAreaRepository: ProtectedAreaRepository,
  ) {
    super(repository);
  }

  private async validateFunderAndProtectedArea(
    funderId: string,
    protectedAreaId: string,
  ) {
    const funder = await this.funderRepository.findById(funderId);
    if (!funder) {
      throw new Error(`Funder with ID ${funderId} does not exist.`);
    }

    const protectedArea =
      await this.protectedAreaRepository.findById(protectedAreaId);
    if (!protectedArea) {
      throw new Error(
        `Protected Area with ID ${protectedAreaId} does not exist.`,
      );
    }

    return { funder, protectedArea };
  }

  async create(data: {
    funderId: string;
    protectedAreaId: string;
  }): Promise<Funding> {
    const validation = await this.validateFunderAndProtectedArea(
      data.funderId,
      data.protectedAreaId,
    );
    return this.repository.create({
      funder: validation.funder,
      protectedArea: validation.protectedArea,
    });
  }

  findByProtectedArea(protectedAreaId: string): Promise<Funding[]> {
    return this.repository.findByAPId(protectedAreaId);
  }
}
