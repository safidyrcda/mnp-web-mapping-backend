import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from 'src/presentation/controller/src/project.controller';
import { Project } from 'src/infrastructure/models/project.model';
import { ProjectRepository } from 'src/infrastructure/repositories/src/project.repository';
import { ProjectService } from 'src/application/services/src/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectRepository, ProjectService],
  exports: [ProjectRepository, ProjectService],
})
export class ProjectModule {}
