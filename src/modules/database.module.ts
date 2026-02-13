import { Global, Module } from '@nestjs/common';

import { ProtectedArea } from '../models/protected-area.model';
import { Funder } from 'src/models/funder.model';
import { Funding } from 'src/models/funding.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'arcgis_test',
      schema: 'public',
      entities: [ProtectedArea, Funder, Funding],
      synchronize: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
