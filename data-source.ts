import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Funder } from './src/infrastructure/models/funder.model';
import { Funding } from './src/infrastructure/models/funding.model';
import { ProtectedArea } from './src/infrastructure/models/protected-area.model';
import { Project } from './src/infrastructure/models/project.model';
import { FunderFunding } from './src/infrastructure/models/funding-funder.model';

dotenv.config({ path: `.env` });
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_LISTEN_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: 'public',

  entities: [Funder, Funding, ProtectedArea, Project, FunderFunding],
  migrations: ['src/infrastructure/migrations/*.ts'],
  synchronize: false,
});
