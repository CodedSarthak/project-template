import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

const ACCESS_TOKEN_SECRET = env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRATION = (env.JWT_ACCESS_EXPIRATION) as SignOptions["expiresIn"];
const REFRESH_TOKEN_EXPIRATION = (env.JWT_REFRESH_EXPIRATION) as SignOptions["expiresIn"];

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRATION || !REFRESH_TOKEN_EXPIRATION) {
    throw new Error('JWT secrets or expiration times are missing from environment variables!');
}

// Payload carried by the short-lived access token
export interface TokenPayload {
    userId: string;
}

// Payload carried by the long-lived refresh token.
export interface RefreshTokenPayload {
    userId: string;
    sessionId: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    } catch {
        return null;
    }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET as string) as RefreshTokenPayload;
    } catch {
        return null;
    }
};

export const generateAuthTokens = (
    userId: string,
    sessionId: string
): { accessToken: string; refreshToken: string } => {
    const accessToken = generateAccessToken({ userId });
    const refreshToken = generateRefreshToken({ userId, sessionId });
    return { accessToken, refreshToken };
};

export const parseDurationToMs = (duration: string): number => {
    const match = duration.match(/^(\d+)([smhd])$/i);
    if (!match || !match[1] || !match[2]) {
        return 0;
    }
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };
    return value * (multipliers[unit] ?? 1000);
};

export const getAccessTokenExpiresInMs = (): number => {
    return parseDurationToMs(env.JWT_ACCESS_EXPIRATION) || 15 * 60 * 1000;
};

export const getRefreshTokenExpiresInMs = (): number => {
    return parseDurationToMs(env.JWT_REFRESH_EXPIRATION) || 7 * 24 * 60 * 60 * 1000;
};

export const getRefreshTokenExpiryDate = (): Date => {
    return new Date(Date.now() + getRefreshTokenExpiresInMs());
};