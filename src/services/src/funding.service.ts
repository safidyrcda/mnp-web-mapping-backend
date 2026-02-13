import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Funding } from 'src/models/funding.model';
import { FundingRepository } from 'src/repositories/src/funding.repository';

@Injectable()
export class FundingService extends BaseService<Funding> {
  constructor(protected repository: FundingRepository) {
    super(repository);
  }
}
