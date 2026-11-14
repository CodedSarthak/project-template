import 'dotenv/config';

export function getRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

export const env = {
  NODE_ENV,
  PORT: Number(process.env.PORT || 3000),
  isProduction,

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // JWT Configuration (central auth shared secret or public key)
  JWT_ACCESS_SECRET: isProduction
    ? getRequiredEnv('JWT_ACCESS_SECRET')
    : process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_key_minimum_32_characters_long',

  // Database Configuration
  DATABASE_URL: isProduction
    ? getRequiredEnv('DATABASE_URL')
    : process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mydb',

  // S3 Configuration (defaults provided for dev, override in production)
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  S3_BUCKET: process.env.S3_BUCKET || '',
};
