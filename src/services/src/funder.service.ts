import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Funder } from 'src/models/funder.model';
import { FunderRepository } from 'src/repositories/src/funder.repository';

@Injectable()
export class FunderService extends BaseService<Funder> {
  constructor(protected repository: FunderRepository) {
    super(repository);
  }
}
