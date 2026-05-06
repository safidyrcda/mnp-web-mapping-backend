import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DisbursementService } from 'src/application/services/src/disbursement.service';
import { Disbursement } from 'src/infrastructure/models/disbursement.model';
import { CreateDisbursementDto } from 'src/presentation/dtos/disbursement/create-disbursement.dto';
import { FundingRepository } from 'src/infrastructure/repositories/src/funding.repository';

@Controller('fundings/:fundingId/disbursements')
export class DisbursementController {
  constructor(
    private readonly disbursementService: DisbursementService,
    private readonly fundingRepository: FundingRepository,
  ) {}

  @Get()
  findAll(@Param('fundingId') fundingId: string): Promise<Disbursement[]> {
    return this.disbursementService.findByFunding(fundingId);
  }

  @Post()
  async create(
    @Param('fundingId') fundingId: string,
    @Body() data: CreateDisbursementDto,
  ): Promise<Disbursement> {
    const funding = await this.fundingRepository.findById(fundingId);
    if (!funding)
      throw new Error(`Funding with ID ${fundingId} does not exist.`);
    return this.disbursementService.create({
      ...data,
      date: new Date(data.date),
      funding,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.disbursementService.delete(id);
  }
}
