// src/infrastructure/repositories/src/funder-funding.repository.ts  (INCHANGÉ)
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { FunderFunding } from 'src/infrastructure/models/funding-funder.model';

@Injectable()
export class FunderFundingRepository extends BaseRepository<FunderFunding> {
  constructor(dataSource: DataSource) {
    super(dataSource, FunderFunding);
  }
}
