import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { ProtectedAreaRepository } from 'src/repositories/src/protected-area.repository';
import { ProtectedArea } from 'src/models/protected-area.model';

@Injectable()
export class ProtectedAreaService extends BaseService<ProtectedArea> {
  constructor(protected repository: ProtectedAreaRepository) {
    super(repository);
  }

  findAllGeoJSON() {
    return this.repository.findAllGeoJSON();
  }

  findOneAPGeometry(id: string) {
    return this.repository.findOneAPGeometry(id);
  }
}
