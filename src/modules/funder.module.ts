import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FunderController } from 'src/presentation/controller/src/funder.controller';
import { Funder } from 'src/infrastructure/models/funder.model';
import { FunderRepository } from 'src/infrastructure/repositories/src/funder.repository';
import { FunderService } from 'src/application/services/src/funder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Funder])],
  controllers: [FunderController],
  providers: [FunderRepository, FunderService],
  exports: [FunderRepository, FunderService],
})
export class FunderModule {}
