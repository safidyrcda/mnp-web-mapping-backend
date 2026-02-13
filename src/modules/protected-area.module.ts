import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectedAreaController } from 'src/controller/src/protected-area.controller';
import { ProtectedArea } from 'src/models/protected-area.model';
import { ProtectedAreaRepository } from 'src/repositories/src/protected-area.repository';
import { ProtectedAreaService } from 'src/services/src/protected-area.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProtectedArea])],
  controllers: [ProtectedAreaController],
  providers: [ProtectedAreaRepository, ProtectedAreaService],
  exports: [ProtectedAreaRepository, ProtectedAreaService],
})
export class ProtectedAreaModule {}
