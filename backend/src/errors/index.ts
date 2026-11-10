import { ErrorCode } from '@project-template/shared';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    code: string = ErrorCode.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends AppError {
  constructor(message = 'Bad Request', code: string = ErrorCode.BAD_REQUEST) {
    super(message, 400, code);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = 'Unauthenticated', code: string = ErrorCode.UNAUTHENTICATED) {
    super(message, 401, code);
  }
}

export class ForbiddenException extends AppError {
  constructor(message = 'Forbidden', code: string = ErrorCode.UNAUTHORIZED) {
    super(message, 403, code);
  }
}

export class NotFoundException extends AppError {
  constructor(message = 'Resource not found', code: string = ErrorCode.RESOURCE_NOT_FOUND) {
    super(message, 404, code);
  }
}

export class ConflictException extends AppError {
  constructor(message = 'Conflict', code: string = ErrorCode.CONFLICT) {
    super(message, 409, code);
  }
}

export class TooManyRequestsException extends AppError {
  constructor(message = 'Too many requests', code: string = ErrorCode.TOO_MANY_REQUESTS) {
    super(message, 429, code);
  }
}

export class UnprocessableEntityException extends AppError {
  constructor(message = 'Unprocessable Entity', code: string = ErrorCode.UNPROCESSABLE_ENTITY) {
    super(message, 422, code);
  }
}

export class InternalServerException extends AppError {
  constructor(message = 'Internal server error', code: string = ErrorCode.INTERNAL_SERVER_ERROR) {
    super(message, 500, code, false);
  }
}
