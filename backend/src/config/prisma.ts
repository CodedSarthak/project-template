
import { PrismaClient, Prisma } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env.js';

const globalForPrisma = globalThis as unknown as {
  prismaPool?: Pool;
  prisma?: PrismaClient;
};

const pool =
  globalForPrisma.prismaPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prismaPool = pool;
  globalForPrisma.prisma = prisma;
}

export { Prisma };
export type { PrismaClient };

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}
