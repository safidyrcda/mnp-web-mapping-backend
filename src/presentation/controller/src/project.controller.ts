import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Funder } from 'src/infrastructure/models/funder.model';
import { CreateFunderDto } from 'src/presentation/dtos/funder/create-funder.dto';
import { ProjectService } from 'src/application/services/src/project.service';
import { Project } from 'src/infrastructure/models/project.model';
import { CreateProjectDto } from 'src/presentation/dtos/project/create-funder.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Post()
  async create(@Body() data: CreateProjectDto): Promise<Project> {
    return this.projectService.create(data);
  }

  //   @Patch(':id')
  //   async update(
  //     @Param('id') id: string,
  //     @Body() data: Partial<Funder>,
  //   ): Promise<Funder | null> {
  //     return this.funderService.update(id, data);
  //   }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.projectService.delete(id);
  }
}
