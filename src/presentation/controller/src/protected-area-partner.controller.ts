import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ProtectedAreaPartnerRepository } from 'src/infrastructure/repositories/src/protected-area-partner.repository';
import { UpsertProtectedAreaPartnersDto } from 'src/presentation/dtos/protected-area-partner/upsert-protected-area-partners.dto';

@Controller('protected-area-partners')
export class ProtectedAreaPartnerController {
  constructor(private readonly repository: ProtectedAreaPartnerRepository) {}

  @Get('protected-area/:protectedAreaId')
  findByProtectedArea(@Param('protectedAreaId') protectedAreaId: string) {
    return this.repository.findByProtectedArea(protectedAreaId);
  }

  @Put('protected-area/:protectedAreaId')
  upsertForProtectedArea(
    @Param('protectedAreaId') protectedAreaId: string,
    @Body() dto: UpsertProtectedAreaPartnersDto,
  ) {
    return this.repository.upsertForProtectedArea(protectedAreaId, dto.entries);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
