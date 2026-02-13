import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Funding } from 'src/models/funding.model';

@Injectable()
export class FundingRepository extends BaseRepository<Funding> {
  constructor(dataSource: DataSource) {
    super(dataSource, Funding);
  }
}
