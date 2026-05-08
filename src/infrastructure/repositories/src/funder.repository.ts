import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Funder } from 'src/infrastructure/models/funder.model';
import { FunderFunding } from 'src/infrastructure/models/funding-funder.model';

@Injectable()
export class FunderRepository extends BaseRepository<Funder> {
  constructor(dataSource: DataSource) {
    super(dataSource, Funder);
  }

  async find(): Promise<Funder[]> {
    return this.dataSource.getRepository(Funder).find({
      order: { name: 'ASC' },
    });
  }

  async findOneByName(name: string) {
    return this.dataSource.getRepository(Funder).findOneBy({ name });
  }
}
