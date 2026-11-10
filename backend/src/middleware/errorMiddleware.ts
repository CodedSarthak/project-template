import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorCode, type ApiErrorResponse } from '@project-template/shared';
import { AppError } from '../errors/index.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {

  if (err instanceof ZodError) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Validation error',
      errors: err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    };
    res.status(400).json(errorResponse);
    return;
  }

  if (err instanceof AppError) {
    if (err.isOperational) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        code: err.code,
        message: err.message,
      };
      res.status(err.statusCode).json(errorResponse);
      return;
    }
  }

  console.error('[Unhandled Server Error]', err);

  const serverErrorResponse: ApiErrorResponse = {
    success: false,
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'An unexpected internal server error occurred',
  };

  res.status(500).json(serverErrorResponse);
}
