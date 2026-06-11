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
import { ProtectedAreaFunderService } from 'src/application/services/src/protected-area-funder.service';
import { ProtectedAreaFunder } from 'src/infrastructure/models/protected-area-funder';
import { CreateProtectedAreaFunderDto } from 'src/presentation/dtos/protected-area-funder/create-protected-area-funder.dto';
import { UpdateProtectedAreaFunderDto } from 'src/presentation/dtos/protected-area-funder/update-protected-area-funder.dto';
import { UpsertProtectedAreaFundersDto } from 'src/presentation/dtos/protected-area-funder/upsert-protected-area-funder.dto';

@Controller('protected-area-funders')
export class ProtectedAreaFunderController {
  constructor(private readonly service: ProtectedAreaFunderService) {}

  @Get()
  findAll(): Promise<ProtectedAreaFunder[]> {
    return this.service.findAll();
  }

  @Get('protected-area/:protectedAreaId')
  findByProtectedArea(@Param('protectedAreaId') protectedAreaId: string) {
    return this.service.findByProtectedArea(protectedAreaId);
  }

  @Get('funder/:funderId')
  findByFunder(@Param('funderId') funderId: string) {
    return this.service.findByFunder(funderId);
  }

  @Post()
  create(
    @Body() data: CreateProtectedAreaFunderDto,
  ): Promise<ProtectedAreaFunder> {
    return this.service.create(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateProtectedAreaFunderDto,
  ): Promise<ProtectedAreaFunder> {
    return this.service.update(id, data);
  }

  @Put('protected-area/:protectedAreaId')
  upsertForProtectedArea(
    @Param('protectedAreaId') protectedAreaId: string,
    @Body() dto: UpsertProtectedAreaFundersDto,
  ) {
    return this.service.upsertForProtectedArea(protectedAreaId, dto.entries);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}
