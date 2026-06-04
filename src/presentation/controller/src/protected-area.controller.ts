import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ProtectedAreaService } from 'src/application/services/src/protected-area.service';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { UpdateProtectedAreaDto } from 'src/presentation/dtos/protected-area/update-protected-area.dto';

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

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.protectedAreaService.delete(id);
  }

  @Get(':id/detail')
  async findDetail(@Param('id') id: string) {
    return this.protectedAreaService.findDetail(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProtectedAreaDto) {
    return this.protectedAreaService.update(id, dto);
  }
}
