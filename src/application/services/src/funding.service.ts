import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Funding } from 'src/infrastructure/models/funding.model';
import { FundingRepository } from 'src/infrastructure/repositories/src/funding.repository';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { ProjectRepository } from 'src/infrastructure/repositories/src/project.repository';
import { FunderFundingRepository } from 'src/infrastructure/repositories/src/funder-funding.repository';
import { ProtectedAreaFundingRepository } from 'src/infrastructure/repositories/src/protected-area-funding.repository';
import { DisbursementRepository } from 'src/infrastructure/repositories/src/disbursement.repository';
import { ActivityRepository } from 'src/infrastructure/repositories/src/activity.repository';
import { ActivityFundingRepository } from 'src/infrastructure/repositories/src/activity-funding.repository';
import { Funder } from 'src/infrastructure/models/funder.model';
import { Activity } from 'src/infrastructure/models/activity.model';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { CreateDisbursementDto } from 'src/presentation/dtos/disbursement/create-disbursement.dto';
import { CreateActivityDto } from 'src/presentation/dtos/activity/create-activity.dto';
import { FunderFundingType } from 'src/infrastructure/models/funding-funder.model';
import { CreatePartnershipDto } from 'src/presentation/dtos/funding/create-partnership.dto';

export interface PAFundingEntry {
  protectedAreaId: string;
  amount?: number;
  currency?: string;
  amountInEuro?: number;
  note?: string;
}

export interface FunderFundingEntry {
  funderId: string;
  type?: FunderFundingType;
}

export interface CreateFundingData {
  funderId: string;
  protectedAreaIds: string[];
  projectId?: string;
  name?: string;
  debut?: string;
  end?: string;
  amount?: number;
  currency?: string;
  amountInEuro?: number;
  disbursements?: CreateDisbursementDto[];
  description?: string;
  // IDs d'activités existantes à lier + éventuellement de nouvelles à créer
  activityIds?: string[];
  newActivities?: CreateActivityDto[];
}

export interface GetFundingDetailData extends Funder {
  type?: FunderFundingType;
}

export interface UpdateFundingData {
  funderId?: string;
  protectedAreaIds?: string[];
  projectId?: string;
  name?: string;
  debut?: Date;
  end?: Date;
  amount?: number;
  currency?: string;
  amountInEuro?: number;
  description?: string;
  disbursements?: CreateDisbursementDto[];
  activityIds?: string[];
  newActivities?: CreateActivityDto[];
}

@Injectable()
export class FundingService extends BaseService<Funding> {
  constructor(
    protected repository: FundingRepository,
    private funderRepository: FunderRepository,
    private funderFundingRepository: FunderFundingRepository,
    private protectedAreaRepository: ProtectedAreaRepository,
    private protectedAreaFundingRepository: ProtectedAreaFundingRepository,
    private projectRepository: ProjectRepository,
    private disbursementRepository: DisbursementRepository,
    private activityRepository: ActivityRepository,
    private activityFundingRepository: ActivityFundingRepository,
  ) {
    super(repository);
  }

  async findAll(): Promise<Funding[]> {
    return this.repository.find();
  }

  async create(data: CreateFundingData): Promise<Funding> {
    // 1. Valider les APs
    const protectedAreas = await this.resolveProtectedAreas(
      data.protectedAreaIds,
    );

    const funder = await this.funderRepository.findById(data.funderId);
    if (!funder)
      throw new Error(`Funder with ID ${data.funderId} does not exist.`);

    // 3. Construire le funding
    const newFunding: Partial<Funding> = {};

    newFunding.funder = funder;
    if (data.name) newFunding.name = data.name;
    if (data.amount) newFunding.amount = data.amount;
    if (data.amountInEuro) newFunding.amountInEuro = data.amountInEuro;
    if (data.debut) newFunding.debut = new Date(data.debut);
    if (data.end) newFunding.end = new Date(data.end);
    if (data.currency) newFunding.currency = data.currency;

    if (data.projectId) {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project)
        throw new Error(`Project with ID ${data.projectId} does not exist.`);
      newFunding.project = project;
    }

    if (data.description !== undefined)
      newFunding.description = data.description;

    const createdFunding = await this.repository.create(newFunding);

    // 4. Créer les relations ProtectedArea
    for (const pa of protectedAreas) {
      await this.protectedAreaFundingRepository.create({
        protectedArea: pa,
        funding: createdFunding,
      });
    }

    // 6. Créer les décaissements si fournis
    if (data.disbursements?.length) {
      for (const d of data.disbursements) {
        await this.disbursementRepository.create({
          ...d,
          date: new Date(d.date),
          funding: createdFunding,
        });
      }
    }

    // 7. Lier des activités existantes (par ID) + en créer de nouvelles → table ActivityFunding
    const activitiesToLink = await this.resolveActivities(
      data.activityIds ?? [],
    );
    for (const a of activitiesToLink) {
      await this.activityFundingRepository.create({
        activity: a,
        funding: createdFunding,
      });
    }

    if (data.newActivities?.length) {
      for (const dto of data.newActivities) {
        const created = await this.activityRepository.create(dto);
        await this.activityFundingRepository.create({
          activity: created,
          funding: createdFunding,
        });
      }
    }

    return createdFunding;
  }

  async update(id: string, data: UpdateFundingData): Promise<Funding> {
    const funding = await this.repository.findById(id);
    if (!funding) throw new Error(`Funding with ID ${id} does not exist.`);

    if (data.name !== undefined) funding.name = data.name;
    if (data.amount) funding.amount = data.amount;
    if (data.amountInEuro !== undefined)
      funding.amountInEuro = data.amountInEuro;
    if (data.debut) funding.debut = new Date(data.debut);
    if (data.end) funding.end = new Date(data.end);
    if (data.currency) funding.currency = data.currency;

    if (data.projectId !== undefined) {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project)
        throw new Error(`Project with ID ${data.projectId} does not exist.`);
      funding.project = project;
    }

    if (data.description !== undefined) funding.description = data.description;

    // Mise à jour des bailleurs
    if (data.funderId) {
      const funder = await this.funderRepository.findById(data.funderId);
      if (!funder)
        throw new Error(`Funder with ID ${data.funderId} does not exist.`);
      funding.funder = funder; // ← seulement l'id
    }

    console.log('Updating funding with data:', funding);

    const updatedFunding = await this.repository.updateFunding(id, funding);

    console.log('Updated funding:', updatedFunding);
    if (!updatedFunding)
      throw new Error(`Funding with ID ${id} could not be updated.`);

    // Mise à jour des APs
    if (data.protectedAreaIds) {
      await this.protectedAreaFundingRepository.deleteByFundingId(id);
      const protectedAreas = await this.resolveProtectedAreas(
        data.protectedAreaIds,
      );
      for (const pa of protectedAreas) {
        await this.protectedAreaFundingRepository.create({
          protectedArea: pa,
          funding: updatedFunding,
        });
      }
    }

    // Remplacement des décaissements
    if (data.disbursements) {
      await this.disbursementRepository.deleteByFundingId(id);
      for (const d of data.disbursements) {
        await this.disbursementRepository.create({
          ...d,
          date: new Date(d.date),
          funding: updatedFunding,
        });
      }
    }

    // Mise à jour des liaisons Activity ↔ Funding (many-to-many)
    // On supprime les liaisons existantes pour ce funding, puis on recrée
    if (data.activityIds !== undefined || data.newActivities !== undefined) {
      await this.activityFundingRepository.deleteByFundingId(id);

      const activitiesToLink = await this.resolveActivities(
        data.activityIds ?? [],
      );
      for (const a of activitiesToLink) {
        await this.activityFundingRepository.create({
          activity: a,
          funding: updatedFunding,
        });
      }

      if (data.newActivities?.length) {
        for (const dto of data.newActivities) {
          const created = await this.activityRepository.create(dto);
          await this.activityFundingRepository.create({
            activity: created,
            funding: updatedFunding,
          });
        }
      }
    }

    return updatedFunding;
  }

  async findFundersByProtectedArea(protectedAreaId: string): Promise<Funder[]> {
    const fundings = await this.repository.findByAPId(protectedAreaId);
    const fundersMap = new Map<string, Funder>();
    for (const funding of fundings) {
      for (const ff of funding.funderFundings ?? []) {
        const funder = ff.funder!;
        if (!fundersMap.has(funder.id!)) fundersMap.set(funder.id!, funder);
      }
    }
    return Array.from(fundersMap.values());
  }

  async findFundersByFunding(
    fundingId: string,
  ): Promise<GetFundingDetailData[]> {
    const funderFundings = await this.repository.findAllFunder(fundingId);
    const fundersMap = new Map<string, GetFundingDetailData>();
    for (const ff of funderFundings) {
      const funder = ff.funder!;
      if (!fundersMap.has(funder.id!))
        fundersMap.set(funder.id!, { ...funder, type: ff.type });
    }
    return Array.from(fundersMap.values());
  }

  findByProtectedArea(protectedAreaId: string): Promise<Funding[]> {
    return this.repository.findByAPId(protectedAreaId);
  }

  // ─── helpers privés ───────────────────────────────────────────────────────

  private async resolveProtectedAreas(ids: string[]): Promise<ProtectedArea[]> {
    const results: ProtectedArea[] = [];
    for (const id of ids) {
      const pa = await this.protectedAreaRepository.findById(id);
      if (!pa) throw new Error(`Protected Area with ID ${id} does not exist.`);
      results.push(pa);
    }
    return results;
  }

  private async resolveFunders(ids: string[]): Promise<Funder[]> {
    const results: Funder[] = [];
    for (const id of ids) {
      const funder = await this.funderRepository.findById(id);
      if (!funder) throw new Error(`Funder with ID ${id} does not exist.`);
      results.push(funder);
    }
    return results;
  }

  private async resolveActivities(ids: string[]): Promise<Activity[]> {
    const results: Activity[] = [];
    for (const id of ids) {
      const activity = await this.activityRepository.findById(id);
      if (!activity) throw new Error(`Activity with ID ${id} does not exist.`);
      results.push(activity);
    }
    return results;
  }

  /**
   * GET :fundingId/protected-area-fundings
   * Retourne toutes les liaisons ProtectedAreaFunding d'un financement
   */
  async findProtectedAreaFundings(fundingId: string) {
    return this.protectedAreaFundingRepository.findByFundingId(fundingId);
  }

  /**
   * PUT :fundingId/protected-area-fundings
   * Remplace toutes les liaisons AP d'un financement (upsert complet)
   */
  async upsertProtectedAreaFundings(
    fundingId: string,
    entries: PAFundingEntry[],
  ) {
    const funding = await this.repository.findById(fundingId);
    if (!funding)
      throw new Error(`Funding with ID ${fundingId} does not exist.`);

    // Supprimer les liaisons existantes
    await this.protectedAreaFundingRepository.deleteByFundingId(fundingId);

    // Recréer avec les nouvelles valeurs
    for (const entry of entries) {
      const pa = await this.protectedAreaRepository.findById(
        entry.protectedAreaId,
      );
      if (!pa)
        throw new Error(
          `Protected Area with ID ${entry.protectedAreaId} does not exist.`,
        );

      await this.protectedAreaFundingRepository.create({
        protectedArea: pa,
        funding,
        amount: entry.amount,
        currency: entry.currency,
        note: entry.note,
        amountInEuro: entry.amountInEuro,
      });
    }

    return this.protectedAreaFundingRepository.findByFundingId(fundingId);
  }

  /**
   * GET :fundingId/funder-fundings
   * Retourne toutes les liaisons FunderFunding d'un financement (avec type)
   */
  async findFunderFundings(fundingId: string) {
    return this.funderFundingRepository.findByFundingId(fundingId);
  }

  /**
   * PUT :fundingId/funder-fundings
   * Remplace toutes les liaisons Funder d'un financement (upsert complet)
   */
  async upsertFunderFundings(fundingId: string, entries: FunderFundingEntry[]) {
    const funding = await this.repository.findById(fundingId);
    if (!funding)
      throw new Error(`Funding with ID ${fundingId} does not exist.`);

    await this.funderFundingRepository.deleteByFundingId(fundingId);

    for (const entry of entries) {
      const funder = await this.funderRepository.findById(entry.funderId);
      if (!funder)
        throw new Error(`Funder with ID ${entry.funderId} does not exist.`);

      await this.funderFundingRepository.create({
        funder,
        funding,
        type: entry.type,
      });
    }

    return this.funderFundingRepository.findByFundingId(fundingId);
  }

  async createPartnership(data: CreatePartnershipDto): Promise<Funding> {
    if (!data.protectedAreaIds?.length) {
      throw new Error('Au moins une aire protégée doit être sélectionnée.');
    }
    if (!data.fundingType) {
      throw new Error('Le type de partenariat du funder est obligatoire.');
    }

    const protectedAreas = await this.resolveProtectedAreas(
      data.protectedAreaIds,
    );

    const funder = await this.funderRepository.findById(data.funderId);
    if (!funder)
      throw new Error(`Funder with ID ${data.funderId} does not exist.`);

    const newFunding: Partial<Funding> = {
      funder: { id: funder.id } as Funder,
      fundingType: data.fundingType,
      name: data.name,
      description: data.description,
      debut: data.debut ? new Date(data.debut) : undefined,
      end: data.end ? new Date(data.end) : undefined,
      // amount, currency, amountInEuro : pas définis -> null par défaut en base
    };

    const createdFunding = await this.repository.create(newFunding);

    for (const pa of protectedAreas) {
      await this.protectedAreaFundingRepository.create({
        protectedArea: pa,
        funding: createdFunding,
        // amount/currency/amountInEuro non fournis pour un partenariat
      });
    }

    // Activités (existantes + nouvelles), réutilise la logique existante
    const activitiesToLink = await this.resolveActivities(
      data.activityIds ?? [],
    );
    for (const a of activitiesToLink) {
      await this.activityFundingRepository.create({
        activity: a,
        funding: createdFunding,
      });
    }
    if (data.newActivities?.length) {
      for (const dto of data.newActivities) {
        const created = await this.activityRepository.create(dto);
        await this.activityFundingRepository.create({
          activity: created,
          funding: createdFunding,
        });
      }
    }

    return createdFunding;
  }
}
