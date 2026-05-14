import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Produto } from '../entities/Produto';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL não definida. Configure no .env (string de conexão PostgreSQL do Supabase).',
  );
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [Produto],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});
