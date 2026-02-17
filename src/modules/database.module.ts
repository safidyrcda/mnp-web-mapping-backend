import { Global, Module } from '@nestjs/common';

import { ProtectedArea } from '../models/protected-area.model';
import { Funder } from 'src/models/funder.model';
import { Funding } from 'src/models/funding.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Project } from 'src/models/project.model';
import { FunderFunding } from 'src/models/funding-funder.model';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_LISTEN_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        schema: 'public',
        entities: [Funder, Funding, ProtectedArea, Project, FunderFunding],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
