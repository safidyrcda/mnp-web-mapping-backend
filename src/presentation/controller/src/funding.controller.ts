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
import { UpsertProtectedAreaFundingsDto } from 'src/presentation/dtos/funding/upsert-protected-area-fundings.dto';
import { CreateDisbursementDto } from 'src/presentation/dtos/disbursement/create-disbursement.dto';

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

  @Get('protected-area/:protectedAreaId')
  findAllByProtectedArea(@Param('protectedAreaId') protectedAreaId: string) {
    return this.fundingService.findByProtectedArea(protectedAreaId);
  }

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
  update(
    @Param('id') id: string,
    @Body() data: UpdateFundingDto,
  ): Promise<Funding> {
    return this.fundingService.update(id, data);
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
    console.log(dto);
    return this.fundingService.upsertProtectedAreaFundings(
      fundingId,
      dto.entries,
    );
  }

  /**
   * GET /fundings/:fundingId/disbursements
   */
  @Get(':fundingId/disbursements')
  findDisbursements(@Param('fundingId') fundingId: string) {
    return this.fundingService.findProtectedAreaFundings(fundingId); // ← voir note
  }

  /**
   * POST /fundings/:fundingId/disbursements
   */
  @Post(':fundingId/disbursements')
  createDisbursement(
    @Param('fundingId') fundingId: string,
    @Body() data: CreateDisbursementDto,
  ) {
    return this.fundingService.createDisbursement(fundingId, data);
  }
}
