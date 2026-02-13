import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FunderService } from 'src/services/src/funder.service';
import { Funder } from 'src/models/funder.model';

@Controller('funders')
export class FunderController {
  constructor(private readonly funderService: FunderService) {}

  @Get()
  async findAll(): Promise<Funder[]> {
    return this.funderService.findAll();
  }

  @Post()
  async create(@Body() data: Funder): Promise<Funder> {
    return this.funderService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Funder>,
  ): Promise<Funder | null> {
    return this.funderService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.funderService.delete(id);
  }
}
