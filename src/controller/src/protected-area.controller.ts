import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProtectedAreaService } from 'src/services/src/protected-area.service';
import { ProtectedArea } from 'src/models/protected-area.model';

@Controller('protected-areas')
export class ProtectedAreaController {
  constructor(private readonly protectedAreaService: ProtectedAreaService) {}

  @Get()
  async findAll(): Promise<ProtectedArea[]> {
    return this.protectedAreaService.findAll();
  }

  @Get('geojson')
  async findAllGeoJSON() {
    return this.protectedAreaService.findAllGeoJSON();
  }

  @Get('geojson/:id')
  async findById(@Param('id') id: string) {
    return this.protectedAreaService.findOneAPGeometry(id);
  }

  @Post()
  async create(@Body() data: ProtectedArea): Promise<ProtectedArea> {
    return this.protectedAreaService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<ProtectedArea>,
  ): Promise<ProtectedArea | null> {
    return this.protectedAreaService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.protectedAreaService.delete(id);
  }
}
