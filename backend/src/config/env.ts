import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  const missing = env.error.flatten().fieldErrors;
  const message = JSON.stringify(missing, null, 2);
  throw new Error(`Invalid environment variables: ${message}`);
}

export const config = env.data;

export const isProduction = config.NODE_ENV === 'production';
export const isDevelopment = config.NODE_ENV === 'development';
