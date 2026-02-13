import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FunderController } from 'src/controller/src/funder.controller';
import { Funder } from 'src/models/funder.model';
import { FunderRepository } from 'src/repositories/src/funder.repository';
import { FunderService } from 'src/services/src/funder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Funder])],
  controllers: [FunderController],
  providers: [FunderRepository, FunderService],
  exports: [FunderRepository, FunderService],
})
export class FunderModule {}
