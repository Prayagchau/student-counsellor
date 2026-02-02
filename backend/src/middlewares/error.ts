import { Request, Response, NextFunction } from 'express';

/**
 * Custom Error Class
 * Extends Error with status code for HTTP responses
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Global Error Handler
 * Catches all errors and returns appropriate response
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default values
  let statusCode = 500;
  let message = 'Internal server error';
  let stack: string | undefined;

  // Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // Mongoose Duplicate Key Error
  if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    stack = err.stack;
  }

  // Log error (in production, use proper logging service)
  console.error(`[ERROR] ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(stack && { stack }),
  });
};
