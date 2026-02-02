import { Response, NextFunction } from 'express';
import { Booking, Counsellor, User } from '../models';
import { AuthenticatedRequest, BookingStatus, UserRole } from '../types';
import { successResponse, paginatedResponse } from '../utils';
import { AppError } from '../middlewares';

/**
 * Booking Controller
 * Handles all booking-related operations
 */
export class BookingController {
  /**
   * POST /api/bookings
   * Create a new booking (Students only)
   */
  static async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { counsellorId, serviceType, date, timeSlot, notes } = req.body;

      // Verify counsellor exists and is verified
      const counsellor = await Counsellor.findById(counsellorId);
      if (!counsellor) {
        throw new AppError('Counsellor not found', 404);
      }

      if (!counsellor.isVerified) {
        throw new AppError('This counsellor is not yet verified', 400);
      }

      // Check for existing booking at same time
      const existingBooking = await Booking.findOne({
        counsellorId,
        date: new Date(date),
        timeSlot,
        status: { $nin: [BookingStatus.CANCELLED, BookingStatus.REJECTED] },
      });

      if (existingBooking) {
        throw new AppError('This time slot is already booked', 400);
      }

      // Create booking
      const booking = await Booking.create({
        studentId: req.user?.id,
        counsellorId,
        serviceType,
        date: new Date(date),
        timeSlot,
        notes,
        status: BookingStatus.PENDING,
      });

      // Populate for response
      await booking.populate([
        { path: 'counsellor', populate: { path: 'user', select: 'fullName email' } },
      ]);

      successResponse(res, { booking }, 'Booking created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bookings
   * Get bookings (filtered by user role)
   */
  static async getBookings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as BookingStatus;
      const skip = (page - 1) * limit;

      // Build query based on role
      const query: Record<string, unknown> = {};

      if (req.user?.role === UserRole.STUDENT) {
        query.studentId = req.user.id;
      } else if (req.user?.role === UserRole.COUNSELLOR) {
        const counsellor = await Counsellor.findOne({ userId: req.user.id });
        if (counsellor) {
          query.counsellorId = counsellor._id;
        }
      }
      // Admin sees all bookings

      if (status) {
        query.status = status;
      }

      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('student', 'fullName email phone')
          .populate({
            path: 'counsellor',
            populate: { path: 'user', select: 'fullName email' },
          })
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        Booking.countDocuments(query),
      ]);

      paginatedResponse(res, bookings, page, limit, total);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bookings/:id
   * Get single booking by ID
   */
  static async getBookingById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('student', 'fullName email phone')
        .populate({
          path: 'counsellor',
          populate: { path: 'user', select: 'fullName email' },
        });

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Check access rights
      if (req.user?.role === UserRole.STUDENT && booking.studentId.toString() !== req.user.id) {
        throw new AppError('Access denied', 403);
      }

      if (req.user?.role === UserRole.COUNSELLOR) {
        const counsellor = await Counsellor.findOne({ userId: req.user.id });
        if (!counsellor || booking.counsellorId.toString() !== counsellor._id.toString()) {
          throw new AppError('Access denied', 403);
        }
      }

      successResponse(res, { booking });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/bookings/:id/status
   * Update booking status (Counsellor: approve/reject, Admin: any)
   */
  static async updateBookingStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, adminNotes } = req.body;
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Validate status transitions
      const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
        [BookingStatus.PENDING]: [BookingStatus.APPROVED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
        [BookingStatus.APPROVED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
        [BookingStatus.REJECTED]: [],
        [BookingStatus.COMPLETED]: [],
        [BookingStatus.CANCELLED]: [],
      };

      if (!allowedTransitions[booking.status].includes(status)) {
        throw new AppError(`Cannot change status from ${booking.status} to ${status}`, 400);
      }

      // Counsellors can only approve/reject their own bookings
      if (req.user?.role === UserRole.COUNSELLOR) {
        const counsellor = await Counsellor.findOne({ userId: req.user.id });
        if (!counsellor || booking.counsellorId.toString() !== counsellor._id.toString()) {
          throw new AppError('Access denied', 403);
        }

        if (![BookingStatus.APPROVED, BookingStatus.REJECTED, BookingStatus.COMPLETED].includes(status)) {
          throw new AppError('Counsellors can only approve, reject, or complete bookings', 403);
        }
      }

      // Students can only cancel their own pending bookings
      if (req.user?.role === UserRole.STUDENT) {
        if (booking.studentId.toString() !== req.user.id) {
          throw new AppError('Access denied', 403);
        }

        if (status !== BookingStatus.CANCELLED || booking.status !== BookingStatus.PENDING) {
          throw new AppError('Students can only cancel pending bookings', 403);
        }
      }

      booking.status = status;
      if (adminNotes && req.user?.role === UserRole.ADMIN) {
        booking.adminNotes = adminNotes;
      }
      await booking.save();

      successResponse(res, { booking }, 'Booking status updated');
    } catch (error) {
      next(error);
    }
  }
}
