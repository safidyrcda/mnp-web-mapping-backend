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

@Controller('fundings')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  @Get()
  async findAll(): Promise<Funding[]> {
    return this.fundingService.findAll();
  }

  @Post()
  async create(@Body() data: Funding): Promise<Funding> {
    return this.fundingService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Funding>,
  ): Promise<Funding | null> {
    return this.fundingService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.fundingService.delete(id);
  }
}
