import { HTTP_STATUS } from '@shared/constants';

export abstract class BaseException extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationException extends BaseException {
  readonly statusCode = HTTP_STATUS.BAD_REQUEST;
  readonly isOperational = true;

  constructor(message: string, public readonly errors?: string[], context?: Record<string, any>) {
    super(message, context);
  }
}

export class UnauthorizedException extends BaseException {
  readonly statusCode = HTTP_STATUS.UNAUTHORIZED;
  readonly isOperational = true;

  constructor(message: string = 'Unauthorized access', context?: Record<string, any>) {
    super(message, context);
  }
}

export class ForbiddenException extends BaseException {
  readonly statusCode = HTTP_STATUS.FORBIDDEN;
  readonly isOperational = true;

  constructor(message: string = 'Forbidden access', context?: Record<string, any>) {
    super(message, context);
  }
}

export class NotFoundException extends BaseException {
  readonly statusCode = HTTP_STATUS.NOT_FOUND;
  readonly isOperational = true;

  constructor(message: string = 'Resource not found', context?: Record<string, any>) {
    super(message, context);
  }
}

export class ConflictException extends BaseException {
  readonly statusCode = HTTP_STATUS.CONFLICT;
  readonly isOperational = true;

  constructor(message: string = 'Resource conflict', context?: Record<string, any>) {
    super(message, context);
  }
}

export class UnprocessableEntityException extends BaseException {
  readonly statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
  readonly isOperational = true;

  constructor(message: string = 'Unprocessable entity', context?: Record<string, any>) {
    super(message, context);
  }
}

export class TooManyRequestsException extends BaseException {
  readonly statusCode = HTTP_STATUS.TOO_MANY_REQUESTS;
  readonly isOperational = true;

  constructor(message: string = 'Too many requests', context?: Record<string, any>) {
    super(message, context);
  }
}

export class InternalServerException extends BaseException {
  readonly statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  readonly isOperational = false;

  constructor(message: string = 'Internal server error', context?: Record<string, any>) {
    super(message, context);
  }
}
