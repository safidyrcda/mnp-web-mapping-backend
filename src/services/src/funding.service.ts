import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Funding } from 'src/models/funding.model';
import { FundingRepository } from 'src/repositories/src/funding.repository';
import { FunderRepository } from 'src/repositories/src/funder.repository';
import { ProtectedAreaRepository } from 'src/repositories/src/protected-area.repository';
import { ProjectRepository } from 'src/repositories/src/project.repository';
import { Project } from 'src/models/project.model';
import { FunderFundingRepository } from 'src/repositories/src/funder-funding.repository';
import { Funder } from 'src/models/funder.model';

@Injectable()
export class FundingService extends BaseService<Funding> {
  constructor(
    protected repository: FundingRepository,
    private funderRepository: FunderRepository,
    private funderFundingRepository: FunderFundingRepository,
    private protectedAreaRepository: ProtectedAreaRepository,
    private projectRepository: ProjectRepository,
  ) {
    super(repository);
  }

  findAll(): Promise<Funding[]> {
    return this.repository.findAllWithFunders();
  }

  async create(data: {
    funders: string[];
    protectedAreaId: string;
    projectId?: string;
    name?: string;
    debut?: string;
    end?: string;
    amount?: number;
    currency?: string;
  }): Promise<Funding> {
    // 1. Vérifier protected area
    const protectedArea = await this.protectedAreaRepository.findById(
      data.protectedAreaId,
    );

    if (!protectedArea) {
      throw new Error(
        `Protected Area with ID ${data.protectedAreaId} does not exist.`,
      );
    }

    const tempFunders: Funder[] = [];

    for (const funderId of data.funders) {
      const funder = await this.funderRepository.findById(funderId);
      if (!funder) {
        throw new Error(`Funder with ID ${funderId} does not exist.`);
      }
      tempFunders.push(funder);
    }

    const newFunding: Partial<Funding> = {
      protectedArea,
    };

    if (data.name) newFunding.name = data.name;
    if (data.amount) newFunding.amount = data.amount;
    if (data.debut) newFunding.debut = new Date(data.debut);
    if (data.end) newFunding.end = new Date(data.end);
    if (data.currency) newFunding.currency = data.currency;

    if (data.projectId) {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project) {
        throw new Error(`Project with ID ${data.projectId} does not exist.`);
      }
      newFunding.project = project;
    }

    const createdFunding = await this.repository.create(newFunding);

    for (const funder of tempFunders) {
      await this.funderFundingRepository.create({
        funder,
        funding: createdFunding,
      });
    }

    return createdFunding;
  }

  async update(
    id: string,
    data: {
      funders?: string[];
      protectedAreaId?: string;
      projectId?: string;
      name?: string;
      debut?: Date;
      end?: Date;
      amount?: number;
      currency?: string;
    },
  ): Promise<Funding> {
    // 1. Récupérer le funding existant
    const funding = await this.repository.findById(id);
    if (!funding) {
      throw new Error(`Funding with ID ${id} does not exist.`);
    }

    // 2. Mise à jour des champs simples
    if (data.name !== undefined) {
      funding.name = data.name;
    }
    if (data.amount) funding.amount = data.amount;
    if (data.debut) funding.debut = new Date(data.debut);
    if (data.end) funding.end = new Date(data.end);
    if (data.currency) funding.currency = data.currency;

    // 3. Mise à jour protected area
    if (data.protectedAreaId) {
      const protectedArea = await this.protectedAreaRepository.findById(
        data.protectedAreaId,
      );

      if (!protectedArea) {
        throw new Error(
          `Protected Area with ID ${data.protectedAreaId} does not exist.`,
        );
      }

      funding.protectedArea = protectedArea;
    }

    // 4. Mise à jour project
    if (data.projectId !== undefined) {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project) {
        throw new Error(`Project with ID ${data.projectId} does not exist.`);
      }
      funding.project = project;
    }

    // 5. Sauvegarder funding
    const updatedFunding = await this.repository.update(id, funding);
    if (!updatedFunding) {
      throw new Error(`Funding with ID ${id} could not be updated.`);
    }

    // 6. Mise à jour des funders (table de jointure)
    if (data.funders) {
      // Supprimer anciennes relations
      await this.funderFundingRepository.deleteByFundingId(id);

      // Vérifier et recréer
      const funders = await Promise.all(
        data.funders.map(async (providedfunders) => {
          const funder = await this.funderRepository.findById(providedfunders);
          if (!funder) {
            throw new Error(
              `Funder with ID ${providedfunders} does not exist.`,
            );
          }
          return funder;
        }),
      );

      // Recréer les relations
      for (const funder of funders) {
        await this.funderFundingRepository.create({
          funder,
          funding: updatedFunding,
        });
      }
    }

    return updatedFunding;
  }

  findByProtectedArea(protectedAreaId: string) {
    return this.repository.findByAPId(protectedAreaId);
  }
}
