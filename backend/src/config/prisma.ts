import { PrismaClient as AppPrismaClient, type Prisma as AppPrisma } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env.js';

const globalForPrisma = globalThis as unknown as {
  dbPool?: Pool;
  authDb?: AuthPrismaClient;
  appDb?: AppPrismaClient;
};

const pool =
  globalForPrisma.dbPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  });

const adapter = new PrismaPg(pool);

export const appDb: AppPrismaClient = globalForPrisma.appDb ?? new AppPrismaClient({ adapter });
export { AppPrismaClient };

if (!env.isProduction) {
  globalForPrisma.dbPool = pool;
}

export type DB = AuthPrismaClient | AuthPrisma.TransactionClient;
