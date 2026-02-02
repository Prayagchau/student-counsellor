import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload, UserRole } from '../types';
import User from '../models/User';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
      return;
    }

    // Check if user is active
    if (user.status !== 'active') {
      res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};

/**
 * Role-based Authorization Middleware
 * Restricts access to specific roles
 * 
 * Usage: authorize(UserRole.ADMIN, UserRole.COUNSELLOR)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
      return;
    }

    next();
  };
};

/**
 * Optional Authentication Middleware
 * Attaches user if token exists, but doesn't require it
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch {
    // Token invalid, but that's okay - continue without user
    next();
  }
};
