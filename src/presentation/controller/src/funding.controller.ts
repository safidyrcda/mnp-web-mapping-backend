import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { FundingService } from 'src/application/services/src/funding.service';
import { Funding } from 'src/infrastructure/models/funding.model';
import { CreateFundingDto } from 'src/presentation/dtos/funding/create-funding.dto';
import { UpdateFundingDto } from 'src/presentation/dtos/funding/update-funding.dto';
import { UpsertFunderFundingsDto } from 'src/presentation/dtos/funding/upsert-funder-fundings.dto';
import { UpsertProtectedAreaFundingsDto } from 'src/presentation/dtos/funding/upsert-protected-area-fundings.dto';

@Controller('fundings')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  @Get()
  findAll(): Promise<Funding[]> {
    return this.fundingService.findAll();
  }

  @Get(':fundingId/funders')
  findAllFunders(@Param('fundingId') fundingId: string) {
    return this.fundingService.findFundersByFunding(fundingId);
  }

  // Tous les fundings liés à une AP
  @Get('protected-area/:protectedAreaId')
  findAllByProtectedArea(@Param('protectedAreaId') protectedAreaId: string) {
    return this.fundingService.findByProtectedArea(protectedAreaId);
  }

  // Tous les bailleurs liés à une AP (via ses fundings)
  @Get('protected-area/:protectedAreaId/funders')
  findAllFundersByProtectedArea(
    @Param('protectedAreaId') protectedAreaId: string,
  ) {
    return this.fundingService.findFundersByProtectedArea(protectedAreaId);
  }

  @Post()
  create(@Body() data: CreateFundingDto): Promise<Funding> {
    return this.fundingService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateFundingDto,
  ): Promise<Funding | null> {
    return this.fundingService.update(id, {
      ...data,
      debut: data.debut ? new Date(data.debut) : undefined,
      end: data.end ? new Date(data.end) : undefined,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.fundingService.delete(id);
  }

  /**
   * GET /fundings/:fundingId/protected-area-fundings
   * Liste les montants par AP pour un financement
   */
  @Get(':fundingId/protected-area-fundings')
  findProtectedAreaFundings(@Param('fundingId') fundingId: string) {
    return this.fundingService.findProtectedAreaFundings(fundingId);
  }

  /**
   * PUT /fundings/:fundingId/protected-area-fundings
   * Remplace les montants par AP (upsert complet)
   */
  @Put(':fundingId/protected-area-fundings')
  upsertProtectedAreaFundings(
    @Param('fundingId') fundingId: string,
    @Body() dto: UpsertProtectedAreaFundingsDto,
  ) {
    return this.fundingService.upsertProtectedAreaFundings(
      fundingId,
      dto.entries,
    );
  }

  /**
   * GET /fundings/:fundingId/funder-fundings
   * Liste les bailleurs + leur type pour un financement
   */
  @Get(':fundingId/funder-fundings')
  findFunderFundings(@Param('fundingId') fundingId: string) {
    return this.fundingService.findFunderFundings(fundingId);
  }

  /**
   * PUT /fundings/:fundingId/funder-fundings
   * Remplace les bailleurs + type (upsert complet)
   */
  @Put(':fundingId/funder-fundings')
  upsertFunderFundings(
    @Param('fundingId') fundingId: string,
    @Body() dto: UpsertFunderFundingsDto,
  ) {
    return this.fundingService.upsertFunderFundings(fundingId, dto.entries);
  }
}
