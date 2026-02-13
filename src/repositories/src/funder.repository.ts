import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Funder } from 'src/models/funder.model';

@Injectable()
export class FunderRepository extends BaseRepository<Funder> {
  constructor(dataSource: DataSource) {
    super(dataSource, Funder);
  }
}
