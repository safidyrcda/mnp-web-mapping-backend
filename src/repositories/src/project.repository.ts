import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { Project } from 'src/models/project.model';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(dataSource: DataSource) {
    super(dataSource, Project);
  }
}
