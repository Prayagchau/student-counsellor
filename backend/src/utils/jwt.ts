import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';

/**
 * Generate JWT Token
 * Creates a signed JWT with user information
 * 
 * @param userId - User's MongoDB ObjectId
 * @param email - User's email
 * @param role - User's role (student/counsellor/admin)
 * @returns Signed JWT string
 */
export const generateToken = (
  userId: string,
  email: string,
  role: UserRole
): string => {
  const payload: JwtPayload = {
    id: userId,
    email,
    role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify JWT Token
 * Verifies and decodes a JWT token
 * 
 * @param token - JWT string to verify
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Decode Token Without Verification
 * Useful for reading token data without validation
 * 
 * @param token - JWT string to decode
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
