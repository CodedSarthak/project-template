import { Request, Response, NextFunction } from 'express';
import { ErrorCode, type ApiErrorResponse } from '@project-template/shared';
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  let token = req.cookies?.accessToken;

  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

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

  req.user = {
    id: decoded.userId,
  };

  next();
};
