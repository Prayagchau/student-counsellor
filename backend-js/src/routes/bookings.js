const express = require('express');
const { BookingController } = require('../controllers');
const { authenticate, authorize, validate } = require('../middlewares');
const { bookingValidators } = require('../validators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private (Users only)
 */
router.post(
  '/',
  authorize('user'),
  validate(bookingValidators.create),
  BookingController.createBooking
);

/**
 * @route   GET /api/bookings/my
 * @desc    Get current user's bookings
 * @access  Private
 */
router.get('/my', BookingController.getMyBookings);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get('/:id', BookingController.getBookingById);

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel booking (for users)
 * @access  Private (Users only)
 */
router.put(
  '/:id/cancel',
  authorize('user'),
  validate(bookingValidators.cancel),
  BookingController.cancelBooking
);

/**
 * @route   PUT /api/bookings/:id/status
 * @desc    Update booking status (for counsellors)
 * @access  Private (Counsellors only)
 */
router.put(
  '/:id/status',
  authorize('counsellor'),
  validate(bookingValidators.updateStatus),
  BookingController.updateBookingStatus
);

module.exports = router;
