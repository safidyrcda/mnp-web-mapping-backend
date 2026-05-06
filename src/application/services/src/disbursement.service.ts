// src/application/services/src/disbursement.service.ts
import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Disbursement } from 'src/infrastructure/models/disbursement.model';
import { DisbursementRepository } from 'src/infrastructure/repositories/src/disbursement.repository';

@Injectable()
export class DisbursementService extends BaseService<Disbursement> {
  constructor(protected repository: DisbursementRepository) {
    super(repository);
  }

  create(data: Partial<Disbursement>): Promise<Disbursement> {
    return this.repository.create(data);
  }

  findByFunding(fundingId: string): Promise<Disbursement[]> {
    return this.repository.findByFundingId(fundingId);
  }
}
