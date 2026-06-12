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
import { ProtectedAreaPartnerService } from 'src/application/services/src/protected-area-partner.service';
import { ProtectedAreaPartner } from 'src/infrastructure/models/protected-area-partner.model';
import { CreateProtectedAreaPartnerDto } from 'src/presentation/dtos/protected-area-partner/create-protected-area-partner.dto';
import { UpdateProtectedAreaPartnerDto } from 'src/presentation/dtos/protected-area-partner/update-protected-area-partner.dto';
import { UpsertProtectedAreaPartnersDto } from 'src/presentation/dtos/protected-area-partner/upsert-protected-area-partners.dto';

@Controller('protected-area-partners')
export class ProtectedAreaPartnerController {
  constructor(private readonly service: ProtectedAreaPartnerService) {}

  @Get()
  findAll(): Promise<ProtectedAreaPartner[]> {
    return this.service.findAll();
  }

  @Get('protected-area/:protectedAreaId')
  findByProtectedArea(@Param('protectedAreaId') protectedAreaId: string) {
    return this.service.findByProtectedArea(protectedAreaId);
  }

  @Get('partner/:partnerId')
  findByPartner(@Param('partnerId') partnerId: string) {
    return this.service.findByPartner(partnerId);
  }

  @Post()
  create(
    @Body() data: CreateProtectedAreaPartnerDto,
  ): Promise<ProtectedAreaPartner> {
    return this.service.create(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateProtectedAreaPartnerDto,
  ): Promise<ProtectedAreaPartner> {
    return this.service.update(id, data);
  }

  @Put('protected-area/:protectedAreaId')
  upsertForProtectedArea(
    @Param('protectedAreaId') protectedAreaId: string,
    @Body() dto: UpsertProtectedAreaPartnersDto,
  ) {
    return this.service.upsertForProtectedArea(protectedAreaId, dto.entries);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}
