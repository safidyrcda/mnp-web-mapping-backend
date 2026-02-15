import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from 'src/controller/src/project.controller';
import { Project } from 'src/models/project.model';
import { ProjectRepository } from 'src/repositories/src/project.repository';
import { ProjectService } from 'src/services/src/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectRepository, ProjectService],
  exports: [ProjectRepository, ProjectService],
})
export class ProjectModule {}
