import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Funder } from 'src/infrastructure/models/funder.model';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';

@Injectable()
export class FunderService extends BaseService<Funder> {
  constructor(protected repository: FunderRepository) {
    super(repository);
  }

  create(data: Partial<Funder>): Promise<Funder> {
    return this.repository.create(data);
  }
}
