import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Funder } from './src/models/funder.model';
import { Funding } from './src/models/funding.model';
import { ProtectedArea } from './src/models/protected-area.model';

const env = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${env}` });
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_LISTEN_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: 'public',

  entities: [Funder, Funding, ProtectedArea],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
