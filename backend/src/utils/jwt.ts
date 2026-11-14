import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

const ACCESS_TOKEN_SECRET = env.JWT_ACCESS_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error('JWT_ACCESS_SECRET is missing from environment variables!');
}

// Payload carried by the short-lived access token: only user ID is present
export interface TokenPayload {
  userId?: string;
  sub?: string;
  id?: string;
  iat?: number;
  exp?: number;
}

/**
 * Verifies the incoming access token against the shared JWT secret (or public key).
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

/**
 * Helper to generate an access token for local development / testing without running the full auth service.
 */
export const generateAccessToken = (
  payload: TokenPayload,
  expiresIn: SignOptions['expiresIn'] = '15m'
): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn });
};
