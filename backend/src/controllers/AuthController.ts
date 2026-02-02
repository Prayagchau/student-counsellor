import { Request, Response, NextFunction } from 'express';
import { User, Counsellor } from '../models';
import { AuthenticatedRequest, UserRole, UserStatus, CounsellorSpecialization } from '../types';
import { generateToken, successResponse, errorResponse } from '../utils';
import { AppError } from '../middlewares';

/**
 * Auth Controller
 * Handles user registration, login, and profile management
 */
export class AuthController {
  /**
   * POST /api/auth/signup
   * Register a new user (Student or Counsellor)
   */
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fullName, email, password, role, phone, counsellorData } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new AppError('An account with this email already exists', 400);
      }

      // Validate role
      if (role === UserRole.ADMIN) {
        throw new AppError('Admin accounts cannot be created through signup', 403);
      }

      // Create user
      const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        password,
        role,
        phone,
        status: role === UserRole.COUNSELLOR ? UserStatus.PENDING : UserStatus.ACTIVE,
      });

      // If counsellor, create counsellor profile
      if (role === UserRole.COUNSELLOR && counsellorData) {
        await Counsellor.create({
          userId: user._id,
          specializations: counsellorData.specializations || [CounsellorSpecialization.CAREER],
          experience: counsellorData.experience || 0,
          bio: counsellorData.bio || 'Professional counsellor',
          qualifications: counsellorData.qualifications || ['Certified Counsellor'],
          hourlyRate: counsellorData.hourlyRate || 500,
          isVerified: false, // Requires admin approval
        });
      }

      // Generate token
      const token = generateToken(user._id.toString(), user.email, user.role);

      // Return success (exclude password from response)
      successResponse(
        res,
        {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
          },
          token,
        },
        role === UserRole.COUNSELLOR
          ? 'Account created. Pending admin verification.'
          : 'Account created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticate user and return JWT token
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user with password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        throw new AppError('No account found with this email address', 401);
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError('Incorrect password. Please try again', 401);
      }

      // Check user status
      if (user.status === UserStatus.BLOCKED) {
        throw new AppError('Your account has been blocked. Please contact support', 403);
      }

      if (user.status === UserStatus.INACTIVE) {
        throw new AppError('Your account is inactive. Please contact support', 403);
      }

      // Generate token
      const token = generateToken(user._id.toString(), user.email, user.role);

      // Get counsellor data if applicable
      let counsellorData = null;
      if (user.role === UserRole.COUNSELLOR) {
        counsellorData = await Counsellor.findOne({ userId: user._id });
      }

      successResponse(res, {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          ...(counsellorData && { isVerified: counsellorData.isVerified }),
        },
        token,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.user?.id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      let counsellorData = null;
      if (user.role === UserRole.COUNSELLOR) {
        counsellorData = await Counsellor.findOne({ userId: user._id });
      }

      successResponse(res, {
        user,
        ...(counsellorData && { counsellorProfile: counsellorData }),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Update user profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fullName, phone, avatar } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { fullName, phone, avatar },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new AppError('User not found', 404);
      }

      successResponse(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/password
   * Change password
   */
  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user?.id).select('+password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      // Update password (will be hashed by pre-save hook)
      user.password = newPassword;
      await user.save();

      successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
}
