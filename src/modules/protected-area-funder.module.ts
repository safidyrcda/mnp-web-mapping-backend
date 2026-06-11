import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { Funder } from 'src/infrastructure/models/funder.model';
import { ProtectedAreaFunderRepository } from 'src/infrastructure/repositories/src/protected-area-funder.repository';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';
import { ProtectedAreaFunderService } from 'src/application/services/src/protected-area-funder.service';
import { ProtectedAreaFunder } from 'src/infrastructure/models/protected-area-funder';
import { ProtectedAreaFunderController } from 'src/presentation/controller/src/protected-area-funder.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProtectedAreaFunder, ProtectedArea, Funder]),
  ],
  controllers: [ProtectedAreaFunderController],
  providers: [
    ProtectedAreaFunderService,
    ProtectedAreaFunderRepository,
    ProtectedAreaRepository,
    FunderRepository,
  ],
  exports: [ProtectedAreaFunderService],
})
export class ProtectedAreaFunderModule {}
