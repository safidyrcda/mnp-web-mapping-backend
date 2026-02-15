import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Funding } from 'src/models/funding.model';
import { FundingRepository } from 'src/repositories/src/funding.repository';
import { FunderRepository } from 'src/repositories/src/funder.repository';
import { ProtectedAreaRepository } from 'src/repositories/src/protected-area.repository';
import { ProjectRepository } from 'src/repositories/src/project.repository';
import { Project } from 'src/models/project.model';

@Injectable()
export class FundingService extends BaseService<Funding> {
  constructor(
    protected repository: FundingRepository,
    private funderRepository: FunderRepository,
    private protectedAreaRepository: ProtectedAreaRepository,
    private projectRepository: ProjectRepository,
  ) {
    super(repository);
  }

  private async validateFunderAndProtectedArea(
    funderId: string,
    protectedAreaId: string,
  ) {
    const funder = await this.funderRepository.findById(funderId);
    if (!funder) {
      throw new Error(`Funder with ID ${funderId} does not exist.`);
    }

    const protectedArea =
      await this.protectedAreaRepository.findById(protectedAreaId);
    if (!protectedArea) {
      throw new Error(
        `Protected Area with ID ${protectedAreaId} does not exist.`,
      );
    }

    return { funder, protectedArea };
  }

  private async validateProject(projectId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} does not exist.`);
    }

    return { project };
  }

  async create(data: {
    funderId: string;
    protectedAreaId: string;
    projectId?: string;
  }): Promise<Funding> {
    const validation = await this.validateFunderAndProtectedArea(
      data.funderId,
      data.protectedAreaId,
    );

    const newFunding: Partial<Funding> = {
      funder: validation.funder,
      protectedArea: validation.protectedArea,
    };
    let project: Project;

    if (data.projectId) {
      const validationProject = await this.validateProject(data.projectId);
      project = validationProject.project;
      newFunding.project = project;
    }

    return this.repository.create(newFunding);
  }

  findByProtectedArea(protectedAreaId: string): Promise<Funding[]> {
    return this.repository.findByAPId(protectedAreaId);
  }
}
