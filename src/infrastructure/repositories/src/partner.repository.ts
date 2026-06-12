import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Partner } from 'src/infrastructure/models/partner.model';

@Injectable()
export class PartnerRepository extends BaseRepository<Partner> {
  constructor(dataSource: DataSource) {
    super(dataSource, Partner);
  }

  async find(): Promise<Partner[]> {
    return this.dataSource.getRepository(Partner).find();
  }
}
