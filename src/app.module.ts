/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pool } from 'pg';
import { DatabaseModule } from './modules/database.module';
import { ProtectedAreaModule } from './modules/protected-area.module';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pool: Pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'arcgis_test',
  password: 'postgres',
  port: 5432,
});

@Module({
  imports: [DatabaseModule, ProtectedAreaModule],
  controllers: [AppController],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  providers: [AppService, { provide: 'PG_POOL', useValue: pool }],
})
export class AppModule {}
