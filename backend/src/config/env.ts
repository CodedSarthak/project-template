import 'dotenv/config';

export function getRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  get NODE_ENV(): string {
    return process.env.NODE_ENV || 'development';
  },
  get PORT(): number {
    return Number(process.env.PORT || 3000);
  },
  get isProduction(): boolean {
    return this.NODE_ENV === 'production';
  },

  // CORS Configuration
  get CORS_ORIGIN(): string {
    return process.env.CORS_ORIGIN || 'http://localhost:5173';
  },

  // JWT Configuration (central auth shared secret or public key)
  get JWT_ACCESS_SECRET(): string {
    return this.isProduction
      ? getRequiredEnv('JWT_ACCESS_SECRET')
      : process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_key_minimum_32_characters_long';
  },

  // Database Configuration
  get DATABASE_URL(): string {
    return this.isProduction
      ? getRequiredEnv('DATABASE_URL')
      : process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mydb';
  },

  // S3 Configuration
  get AWS_REGION(): string {
    return process.env.AWS_REGION || 'us-east-1';
  },
  get S3_BUCKET(): string {
    return process.env.S3_BUCKET || '';
  },
};
