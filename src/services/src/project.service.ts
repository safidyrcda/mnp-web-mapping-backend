import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Project } from 'src/models/project.model';
import { ProjectRepository } from 'src/repositories/src/project.repository';

@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(protected repository: ProjectRepository) {
    super(repository);
  }

  create(data: Partial<Project>): Promise<Project> {
    return this.repository.create(data);
  }
}
