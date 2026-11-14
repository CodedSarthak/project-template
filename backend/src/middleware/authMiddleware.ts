import { Request, Response, NextFunction } from 'express';
import { ErrorCode, type ApiErrorResponse } from '@project-template/shared';
import { verifyAccessToken, type TokenPayload } from '../utils/jwt.js';

function extractUserId(decoded: TokenPayload): string | null {
  const userId = decoded.userId || decoded.sub || decoded.id;
  return userId ? String(userId) : null;
}

function extractToken(req: Request): string | undefined {
  // Check cookie first (wildcard domain cookie from central auth service)
  let token = req.cookies?.accessToken;

  // Fallback to Authorization: Bearer <token>
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  return token;
}

/**
 * Middleware that strictly protects a route.
 * Rejects with 401 UNAUTHENTICATED if the access token is missing, invalid, or expired.
 * Populates req.user = { id: userId }.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      code: ErrorCode.UNAUTHENTICATED,
      message: 'Access token missing',
    };
    res.status(401).json(errorResponse);
    return;
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      code: ErrorCode.UNAUTHENTICATED,
      message: 'Invalid or expired access token',
    };
    res.status(401).json(errorResponse);
    return;
  }

  const userId = extractUserId(decoded);

  if (!userId) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      code: ErrorCode.UNAUTHENTICATED,
      message: 'Invalid access token: missing user identifier (userId, sub, or id)',
    };
    res.status(401).json(errorResponse);
    return;
  }

  req.user = {
    id: userId,
  };

  next();
};

/**
 * Optional middleware: attaches { id: userId } to req.user if a valid token is present,
 * but does not reject the request if absent or expired.
 */
export const optionalAuthenticateToken = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return next();
  }

  const userId = extractUserId(decoded);
  if (userId) {
    req.user = {
      id: userId,
    };
  }

  next();
};
