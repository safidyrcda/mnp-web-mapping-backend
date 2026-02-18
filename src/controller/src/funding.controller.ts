import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FundingService } from 'src/services/src/funding.service';
import { Funding } from 'src/models/funding.model';
import { CreateFundingDto } from 'src/dtos/funding/create-funding.dto';
import { UpdateFundingDto } from 'src/dtos/funding/update-funding.dto';

@Controller('fundings')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  @Get()
  async findAll(): Promise<Funding[]> {
    return this.fundingService.findAll();
  }

  @Get(':fundingId/funders')
  async findAllFunders(@Param('fundingId') fundingId: string) {
    return this.fundingService.findFundersByFunding(fundingId);
  }

  @Get('protected-area/:protectedAreaId')
  async findAllByProtectedArea(
    @Param('protectedAreaId') protectedAreaId: string,
  ) {
    return this.fundingService.findByProtectedArea(protectedAreaId);
  }

  @Get('protected-area/:protectedAreaId/funders')
  async findAllFundersByProtectedArea(
    @Param('protectedAreaId') protectedAreaId: string,
  ) {
    return this.fundingService.findFundersByProtectedArea(protectedAreaId);
  }

  @Post()
  async create(@Body() data: CreateFundingDto): Promise<Funding> {
    return this.fundingService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateFundingDto,
  ): Promise<Funding | null> {
    let debut;
    let end;
    if (data.debut) debut = new Date(data.debut);
    if (data.end) end = new Date(data.end);
    return this.fundingService.update(id, {
      ...data,
      debut: debut,
      end: end,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.fundingService.delete(id);
  }
}
