import { Response, NextFunction } from 'express';
import { Counsellor, User } from '../models';
import { AuthenticatedRequest, UserRole } from '../types';
import { successResponse, paginatedResponse } from '../utils';
import { AppError } from '../middlewares';

/**
 * Counsellor Controller
 * Handles counsellor profile management and listing
 */
export class CounsellorController {
  /**
   * GET /api/counsellors
   * List all verified counsellors with filters
   */
  static async getCounsellors(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const specialization = req.query.specialization as string;
      const search = req.query.search as string;
      const skip = (page - 1) * limit;

      // Build query
      const query: Record<string, unknown> = { isVerified: true };

      if (specialization) {
        query.specializations = specialization;
      }

      let counsellors = await Counsellor.find(query)
        .populate('user', 'fullName email phone avatar')
        .sort({ rating: -1, experience: -1 })
        .skip(skip)
        .limit(limit);

      // Filter by search (name)
      if (search) {
        counsellors = counsellors.filter((c) => {
          const user = c.user as unknown as { fullName: string };
          return user?.fullName?.toLowerCase().includes(search.toLowerCase());
        });
      }

      const total = await Counsellor.countDocuments(query);

      paginatedResponse(res, counsellors, page, limit, total);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/counsellors/:id
   * Get single counsellor profile
   */
  static async getCounsellorById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const counsellor = await Counsellor.findById(req.params.id)
        .populate('user', 'fullName email phone avatar');

      if (!counsellor) {
        throw new AppError('Counsellor not found', 404);
      }

      successResponse(res, { counsellor });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/counsellors/profile
   * Update counsellor's own profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        specializations,
        experience,
        bio,
        qualifications,
        availability,
        hourlyRate,
      } = req.body;

      const counsellor = await Counsellor.findOne({ userId: req.user?.id });

      if (!counsellor) {
        throw new AppError('Counsellor profile not found', 404);
      }

      // Update fields
      if (specializations) counsellor.specializations = specializations;
      if (experience !== undefined) counsellor.experience = experience;
      if (bio) counsellor.bio = bio;
      if (qualifications) counsellor.qualifications = qualifications;
      if (availability) counsellor.availability = availability;
      if (hourlyRate !== undefined) counsellor.hourlyRate = hourlyRate;

      await counsellor.save();
      await counsellor.populate('user', 'fullName email phone avatar');

      successResponse(res, { counsellor }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/counsellors/me
   * Get authenticated counsellor's own profile
   */
  static async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const counsellor = await Counsellor.findOne({ userId: req.user?.id })
        .populate('user', 'fullName email phone avatar');

      if (!counsellor) {
        throw new AppError('Counsellor profile not found', 404);
      }

      successResponse(res, { counsellor });
    } catch (error) {
      next(error);
    }
  }
}
