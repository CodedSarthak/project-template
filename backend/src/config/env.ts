import 'dotenv/config';

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const NODE_ENV = getRequiredEnv('NODE_ENV');

export const env = {
  NODE_ENV,
  PORT: Number(getRequiredEnv('PORT')),
  isProduction: NODE_ENV === 'production',

  // JWT Configuration
  JWT_ACCESS_SECRET: getRequiredEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getRequiredEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRATION: getRequiredEnv('JWT_ACCESS_EXPIRATION'),
  JWT_REFRESH_EXPIRATION: getRequiredEnv('JWT_REFRESH_EXPIRATION'),

  // Database Configuration
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
};