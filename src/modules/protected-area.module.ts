import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectedAreaController } from 'src/presentation/controller/src/protected-area.controller';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { ProtectedAreaService } from 'src/application/services/src/protected-area.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProtectedArea])],
  controllers: [ProtectedAreaController],
  providers: [ProtectedAreaRepository, ProtectedAreaService],
  exports: [ProtectedAreaRepository, ProtectedAreaService],
})
export class ProtectedAreaModule {}
