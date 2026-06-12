import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PartnerService } from 'src/application/services/src/partner.service';
import { Partner } from 'src/infrastructure/models/partner.model';
import { CreatePartnerDto } from 'src/presentation/dtos/partner/create-partner.dto';
import { UpdatePartnerDto } from 'src/presentation/dtos/partner/update-partner.dto';

@Controller('partners')
export class PartnerController {
  constructor(private readonly service: PartnerService) {}

  @Get()
  findAll(): Promise<Partner[]> {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: CreatePartnerDto): Promise<Partner> {
    return this.service.create(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdatePartnerDto,
  ): Promise<Partner | null> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}
