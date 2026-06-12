import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from 'src/infrastructure/models/partner.model';
import { ProtectedAreaPartner } from 'src/infrastructure/models/protected-area-partner.model';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';
import { PartnerRepository } from 'src/infrastructure/repositories/src/partner.repository';
import { ProtectedAreaPartnerRepository } from 'src/infrastructure/repositories/src/protected-area-partner.repository';
import { ProtectedAreaRepository } from 'src/infrastructure/repositories/src/protected-area.repository';
import { PartnerService } from 'src/application/services/src/partner.service';
import { ProtectedAreaPartnerService } from 'src/application/services/src/protected-area-partner.service';
import { PartnerController } from 'src/presentation/controller/src/partner.controller';
import { ProtectedAreaPartnerController } from 'src/presentation/controller/src/protected-area-partner.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partner, ProtectedAreaPartner, ProtectedArea]),
  ],
  controllers: [PartnerController, ProtectedAreaPartnerController],
  providers: [
    PartnerService,
    ProtectedAreaPartnerService,
    PartnerRepository,
    ProtectedAreaPartnerRepository,
    ProtectedAreaRepository,
  ],
  exports: [PartnerService, ProtectedAreaPartnerService],
})
export class ProtectedAreaPartnerModule {}
