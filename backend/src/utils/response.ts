import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Success Response Helper
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

/**
 * Error Response Helper
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: string[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };

  return res.status(statusCode).json(response);
};

/**
 * Paginated Response Helper
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Success'
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  return res.status(200).json(response);
};
