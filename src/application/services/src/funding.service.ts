import { Injectable, NotFoundException } from '@nestjs/common';
import { Funding, FundingType } from 'src/infrastructure/models/funding.model';
import { FundingRepository } from 'src/infrastructure/repositories/src/funding.repository';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';
import { ProjectRepository } from 'src/infrastructure/repositories/src/project.repository';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { ProtectedAreaFundingRepository } from 'src/infrastructure/repositories/src/protected-area-funding.repository';
import { ProtectedAreaPartnerRepository } from 'src/infrastructure/repositories/src/protected-area-partner.repository';
import { ActivityRepository } from 'src/infrastructure/repositories/src/activity.repository';
import { ActivityFundingRepository } from 'src/infrastructure/repositories/src/activity-funding.repository';
import { DisbursementRepository } from 'src/infrastructure/repositories/src/disbursement.repository';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { PartnerType } from 'src/infrastructure/models/protected-area-partner.model';
import { CreateFundingDto } from 'src/presentation/dtos/funding/create-funding.dto';
import { UpdateFundingDto } from 'src/presentation/dtos/funding/update-funding.dto';
import { CreateProtectedAreaFundingDto } from 'src/presentation/dtos/funding/create-protected-area-funding.dto';
import { CreateDisbursementDto } from 'src/presentation/dtos/disbursement/create-disbursement.dto';

@Injectable()
export class FundingService {
  constructor(
    private readonly repository: FundingRepository,
    private readonly funderRepository: FunderRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly protectedAreaRepository: ProtectedAreaRepository,
    private readonly protectedAreaFundingRepository: ProtectedAreaFundingRepository,
    private readonly protectedAreaPartnerRepository: ProtectedAreaPartnerRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly activityFundingRepository: ActivityFundingRepository,
    private readonly disbursementRepository: DisbursementRepository,
  ) {}

  // ── Lecture ──────────────────────────────────────────────────────────────

  findAll(): Promise<Funding[]> {
    return this.repository.find();
  }

  findFundersByFunding(fundingId: string) {
    return this.repository.findAllFunder(fundingId);
  }

  findByProtectedArea(protectedAreaId: string): Promise<Funding[]> {
    return this.repository.findByAPId(protectedAreaId);
  }

  findFundersByProtectedArea(protectedAreaId: string) {
    return this.repository.findByAPId(protectedAreaId).then((fundings) => {
      const map = new Map<
        string,
        { id: string; name: string; fullname?: string }
      >();
      for (const f of fundings) {
        if (f.funder?.id) {
          map.set(f.funder.id, {
            id: f.funder.id,
            name: f.funder.name ?? '',
            fullname: f.funder.fullname,
          });
        }
      }
      return Array.from(map.values());
    });
  }

  // ── Création ─────────────────────────────────────────────────────────────

  async create(data: CreateFundingDto): Promise<Funding> {
    const protectedAreas = await this.resolveProtectedAreas(
      data.protectedAreaIds,
    );

    const funder = await this.funderRepository.findById(data.funderId);
    if (!funder) {
      throw new NotFoundException(
        `Funder with ID ${data.funderId} does not exist.`,
      );
    }

    const newFunding: Partial<Funding> = {
      funder,
      fundingType: data.fundingType ?? FundingType.FUNDER,
    };

    if (data.name !== undefined) newFunding.name = data.name;
    if (data.description !== undefined)
      newFunding.description = data.description;
    if (data.amount !== undefined) newFunding.amount = data.amount;
    if (data.amountInEuro !== undefined)
      newFunding.amountInEuro = data.amountInEuro;
    if (data.currency !== undefined) newFunding.currency = data.currency;
    if (data.debut) newFunding.debut = new Date(data.debut);
    if (data.end) newFunding.end = new Date(data.end);

    if (data.projectId) {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project) {
        throw new NotFoundException(
          `Project with ID ${data.projectId} does not exist.`,
        );
      }
      newFunding.project = project;
    }

    const createdFunding = await this.repository.create(newFunding);

    for (const pa of protectedAreas) {
      await this.protectedAreaFundingRepository.create({
        protectedArea: pa,
        funding: createdFunding,
      });
    }

    await this.syncProtectedAreaPartners(
      createdFunding,
      protectedAreas,
      newFunding.fundingType,
    );

    await this.syncActivities(
      createdFunding.id!,
      data.activityIds,
      data.newActivities,
    );

    return this.repository.findById(createdFunding.id!) as Promise<Funding>;
  }

  // ── Mise à jour ──────────────────────────────────────────────────────────

  async update(id: string, data: UpdateFundingDto): Promise<Funding> {
    const funding = await this.repository.findById(id);
    if (!funding) {
      throw new NotFoundException(`Funding with ID ${id} does not exist.`);
    }

    if (data.name !== undefined) funding.name = data.name;
    if (data.description !== undefined) funding.description = data.description;
    if (data.amount !== undefined) funding.amount = data.amount;
    if (data.amountInEuro !== undefined)
      funding.amountInEuro = data.amountInEuro;
    if (data.currency !== undefined) funding.currency = data.currency;
    if (data.fundingType !== undefined) funding.fundingType = data.fundingType;
    if (data.debut) funding.debut = new Date(data.debut);
    if (data.end) funding.end = new Date(data.end);

    if (data.funderId) {
      const funder = await this.funderRepository.findById(data.funderId);
      if (!funder) {
        throw new NotFoundException(
          `Funder with ID ${data.funderId} does not exist.`,
        );
      }
      funding.funder = funder;
    }

    if (data.projectId !== undefined) {
      if (data.projectId === null || data.projectId === '') {
        funding.project = undefined;
      } else {
        const project = await this.projectRepository.findById(data.projectId);
        if (!project) {
          throw new NotFoundException(
            `Project with ID ${data.projectId} does not exist.`,
          );
        }
        funding.project = project;
      }
    }

    const updatedFunding = await this.repository.updateFunding(id, funding);
    if (!updatedFunding) {
      throw new NotFoundException(
        `Funding with ID ${id} could not be updated.`,
      );
    }

    if (data.protectedAreaIds) {
      const protectedAreas = await this.resolveProtectedAreas(
        data.protectedAreaIds,
      );

      await this.protectedAreaFundingRepository.deleteByFundingId(id);
      for (const pa of protectedAreas) {
        await this.protectedAreaFundingRepository.create({
          protectedArea: pa,
          funding: updatedFunding,
        });
      }

      await this.syncProtectedAreaPartners(
        updatedFunding,
        protectedAreas,
        data.fundingType ?? funding.fundingType,
      );
    }

    if (data.activityIds || data.newActivities) {
      await this.syncActivities(id, data.activityIds, data.newActivities);
    }

    return this.repository.findById(id) as Promise<Funding>;
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  // ── Montants par AP ──────────────────────────────────────────────────────

  findProtectedAreaFundings(fundingId: string) {
    return this.protectedAreaFundingRepository.findByFundingId(fundingId);
  }

  upsertProtectedAreaFundings(
    fundingId: string,
    entries: CreateProtectedAreaFundingDto[],
  ) {
    return this.protectedAreaFundingRepository.upsertForFunding(
      fundingId,
      entries,
    );
  }

  // ── Décaissements ────────────────────────────────────────────────────────

  async createDisbursement(fundingId: string, data: CreateDisbursementDto) {
    const funding = await this.repository.findById(fundingId);
    if (!funding) {
      throw new NotFoundException(
        `Funding with ID ${fundingId} does not exist.`,
      );
    }
    return this.disbursementRepository.create({
      ...data,
      funding,
      date: new Date(data.date),
    });
  }

  // ── Helpers privés ───────────────────────────────────────────────────────

  private async resolveProtectedAreas(ids: string[]): Promise<ProtectedArea[]> {
    const areas: ProtectedArea[] = [];
    for (const id of ids) {
      const pa = await this.protectedAreaRepository.findById(id);
      if (!pa) {
        throw new NotFoundException(
          `Protected area with ID ${id} does not exist.`,
        );
      }
      areas.push(pa);
    }
    return areas;
  }

  private isPartnershipType(type?: FundingType): boolean {
    return (
      type === FundingType.TECHNICAL_PARTNER ||
      type === FundingType.STRATEGICAL_PARTNER ||
      type === FundingType.TECHNICAL_AND_FUNDER
    );
  }

  private mapToPartnerType(type: FundingType): PartnerType {
    return type === FundingType.STRATEGICAL_PARTNER
      ? PartnerType.STRATEGICAL_PARTNER
      : PartnerType.TECHNICAL_PARTNER;
  }

  private async syncProtectedAreaPartners(
    funding: Funding,
    protectedAreas: ProtectedArea[],
    fundingType?: FundingType,
  ) {
    if (!this.isPartnershipType(fundingType) || !funding.funder) return;

    const partnerType = this.mapToPartnerType(fundingType!);

    for (const pa of protectedAreas) {
      const existing =
        await this.protectedAreaPartnerRepository.findByProtectedAreaAndFunder(
          pa.id!,
          funding.funder.id!,
        );

      if (existing) {
        existing.type = partnerType;
        await this.protectedAreaPartnerRepository.update(
          existing.id!,
          existing,
        );
      } else {
        await this.protectedAreaPartnerRepository.create({
          protectedArea: pa,
          funder: funding.funder,
          type: partnerType,
        });
      }
    }
  }

  private async syncActivities(
    fundingId: string,
    activityIds?: string[],
    newActivities?: { title: string; description?: string }[],
  ) {
    if (activityIds) {
      await this.activityFundingRepository.deleteByFundingId(fundingId);
      for (const activityId of activityIds) {
        await this.activityFundingRepository.create({
          funding: { id: fundingId } as Funding,
          activity: { id: activityId } as any,
        });
      }
    }

    if (newActivities && newActivities.length > 0) {
      for (const a of newActivities) {
        const created = await this.activityRepository.create({
          title: a.title,
          description: a.description,
        });
        await this.activityFundingRepository.create({
          funding: { id: fundingId } as Funding,
          activity: created,
        });
      }
    }
  }
}
