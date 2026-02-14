import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pool } from 'pg';
import { DatabaseModule } from './modules/database.module';
import { ProtectedAreaModule } from './modules/protected-area.module';
import { FunderModule } from './modules/funder.module';
import { FundingModule } from './modules/funding.module';
import { ConfigModule } from '@nestjs/config';

const pool: Pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'arcgis_test',
  password: 'postgres',
  port: 5432,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    ProtectedAreaModule,
    FunderModule,
    FundingModule,
  ],
  controllers: [AppController],

  providers: [AppService, { provide: 'PG_POOL', useValue: pool }],
})
export class AppModule {}
