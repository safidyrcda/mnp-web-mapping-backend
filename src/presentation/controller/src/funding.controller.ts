import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FundingService } from 'src/application/services/src/funding.service';
import { Funding } from 'src/infrastructure/models/funding.model';
import { CreateFundingDto } from 'src/presentation/dtos/funding/create-funding.dto';
import { UpdateFundingDto } from 'src/presentation/dtos/funding/update-funding.dto';

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
}
