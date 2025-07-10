import { Request, Response, NextFunction } from 'express';
import { BaseException } from '@shared/exceptions';
import { HTTP_STATUS } from '@shared/constants';
import { ApiResponse } from '@shared/types/common.types';

export class ErrorMiddleware {
  static handle = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // Handle custom exceptions
    if (error instanceof BaseException) {
      const response: ApiResponse = {
        success: false,
        message: error.message,
        errors: error instanceof Error && 'errors' in error ? (error as any).errors : undefined,
      };

      res.status(error.statusCode).json(response);
      return;
    }

    // Handle validation errors from express-validator
    if (error.name === 'ValidationError') {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        errors: [error.message],
      };

      res.status(HTTP_STATUS.BAD_REQUEST).json(response);
      return;
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication failed',
      };

      res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
      return;
    }

    // Handle database errors
    if (error.name === 'MongoError' || error.name === 'SequelizeError') {
      const response: ApiResponse = {
        success: false,
        message: 'Database error occurred',
      };

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
      return;
    }

    // Handle generic errors
    const response: ApiResponse = {
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
    };

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  };

  static notFound = (req: Request, res: Response): void => {
    const response: ApiResponse = {
      success: false,
      message: `Route ${req.method} ${req.path} not found`,
    };

    res.status(HTTP_STATUS.NOT_FOUND).json(response);
  };
}
