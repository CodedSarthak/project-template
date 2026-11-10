import 'dotenv/config';

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const NODE_ENV = process.env.NODE_ENV || 'development';

export const env = {
  NODE_ENV,
  PORT: Number(process.env.PORT || 3000),
  isProduction: NODE_ENV === 'production',

  // JWT Configuration
  JWT_ACCESS_SECRET: getRequiredEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getRequiredEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRATION: getRequiredEnv('JWT_ACCESS_EXPIRATION'),
  JWT_REFRESH_EXPIRATION: getRequiredEnv('JWT_REFRESH_EXPIRATION'),

  // Database Configuration
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),

  // S3 Configuration (defaults provided for dev, override in production)
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  S3_BUCKET: process.env.S3_BUCKET || '',
};
