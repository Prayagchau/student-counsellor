import { Response, NextFunction } from 'express';
import { User, Counsellor, Booking, CounsellingSession } from '../models';
import { AuthenticatedRequest, UserRole, UserStatus, BookingStatus } from '../types';
import { successResponse, paginatedResponse } from '../utils';
import { AppError } from '../middlewares';

/**
 * Admin Controller
 * Handles all admin-specific operations
 */
export class AdminController {
  /**
   * GET /api/admin/stats
   * Get platform statistics
   */
  static async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalStudents,
        totalCounsellors,
        verifiedCounsellors,
        pendingCounsellors,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalSessions,
      ] = await Promise.all([
        User.countDocuments({ role: UserRole.STUDENT }),
        User.countDocuments({ role: UserRole.COUNSELLOR }),
        Counsellor.countDocuments({ isVerified: true }),
        Counsellor.countDocuments({ isVerified: false }),
        Booking.countDocuments(),
        Booking.countDocuments({ status: BookingStatus.PENDING }),
        Booking.countDocuments({ status: BookingStatus.COMPLETED }),
        CounsellingSession.countDocuments(),
      ]);

      // Get recent bookings trend (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentBookings = await Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
      });

      successResponse(res, {
        users: {
          totalStudents,
          totalCounsellors,
          verifiedCounsellors,
          pendingCounsellors,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          completed: completedBookings,
          recentWeek: recentBookings,
        },
        sessions: {
          total: totalSessions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/users
   * List all users with filters
   */
  static async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as UserRole;
      const status = req.query.status as UserStatus;
      const search = req.query.search as string;
      const skip = (page - 1) * limit;

      // Build query
      const query: Record<string, unknown> = {};

      if (role) query.role = role;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(query),
      ]);

      paginatedResponse(res, users, page, limit, total);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/users/:id/status
   * Update user status (block/unblock/activate)
   */
  static async updateUserStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const userId = req.params.id;

      // Prevent admin from changing their own status
      if (userId === req.user?.id) {
        throw new AppError('Cannot change your own status', 400);
      }

      const user = await User.findById(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Prevent blocking other admins
      if (user.role === UserRole.ADMIN && status === UserStatus.BLOCKED) {
        throw new AppError('Cannot block admin users', 400);
      }

      user.status = status;
      await user.save();

      successResponse(res, { user }, `User ${status === UserStatus.BLOCKED ? 'blocked' : 'updated'} successfully`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/counsellors/pending
   * List counsellors pending verification
   */
  static async getPendingCounsellors(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [counsellors, total] = await Promise.all([
        Counsellor.find({ isVerified: false })
          .populate('user', 'fullName email phone createdAt')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Counsellor.countDocuments({ isVerified: false }),
      ]);

      paginatedResponse(res, counsellors, page, limit, total);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/counsellors/:id/verify
   * Verify or reject a counsellor
   */
  static async verifyCounsellor(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isVerified, rejectionReason } = req.body;
      const counsellorId = req.params.id;

      const counsellor = await Counsellor.findById(counsellorId);

      if (!counsellor) {
        throw new AppError('Counsellor not found', 404);
      }

      counsellor.isVerified = isVerified;
      await counsellor.save();

      // Update user status
      const user = await User.findById(counsellor.userId);
      if (user) {
        user.status = isVerified ? UserStatus.ACTIVE : UserStatus.INACTIVE;
        await user.save();
      }

      successResponse(
        res,
        { counsellor },
        isVerified ? 'Counsellor verified successfully' : 'Counsellor verification rejected'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/bookings
   * List all bookings with filters
   */
  static async getAllBookings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as BookingStatus;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const skip = (page - 1) * limit;

      // Build query
      const query: Record<string, unknown> = {};

      if (status) query.status = status;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) (query.date as Record<string, Date>).$gte = new Date(startDate);
        if (endDate) (query.date as Record<string, Date>).$lte = new Date(endDate);
      }

      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('student', 'fullName email')
          .populate({
            path: 'counsellor',
            populate: { path: 'user', select: 'fullName email' },
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Booking.countDocuments(query),
      ]);

      paginatedResponse(res, bookings, page, limit, total);
    } catch (error) {
      next(error);
    }
  }
}
