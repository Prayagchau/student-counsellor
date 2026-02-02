import { Router } from 'express';
import { BookingController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { validate } from '../middlewares';
import { bookingValidators } from '../validators';
import { UserRole } from '../types';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticate);

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private (Students only)
 */
router.post(
  '/',
  authorize(UserRole.STUDENT),
  validate(bookingValidators.create),
  BookingController.createBooking
);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (filtered by role)
 * @access  Private
 */
router.get('/', BookingController.getBookings);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get('/:id', BookingController.getBookingById);

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status
 * @access  Private
 */
router.patch(
  '/:id/status',
  validate(bookingValidators.updateStatus),
  BookingController.updateBookingStatus
);

export default router;
