const { Booking, Counsellor } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Booking Controller
 */
const BookingController = {
  /**
   * Create Booking
   * POST /api/bookings
   */
  createBooking: async (req, res) => {
    try {
      const { counsellorId, bookingDate, timeSlot, notes } = req.body;
      const userId = req.user.id;

      // Check if counsellor exists and is approved
      const counsellor = await Counsellor.findById(counsellorId);
      if (!counsellor) {
        return errorResponse(res, 'Counsellor not found', 404);
      }

      if (!counsellor.approved) {
        return errorResponse(res, 'Counsellor is not approved for bookings', 400);
      }

      // Check for existing booking (double-booking prevention)
      const isBooked = await Booking.isSlotBooked(counsellorId, new Date(bookingDate), timeSlot);
      if (isBooked) {
        return errorResponse(res, 'This time slot is already booked', 400);
      }

      // Create booking
      const booking = await Booking.create({
        userId,
        counsellorId,
        bookingDate: new Date(bookingDate),
        timeSlot,
        notes,
      });

      // Populate details
      await booking.populate([
        { path: 'counsellor', populate: { path: 'user', select: 'name email' } },
      ]);

      return successResponse(res, { booking }, 'Booking created successfully', 201);
    } catch (error) {
      console.error('Create booking error:', error);
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return errorResponse(res, 'This time slot is already booked', 400);
      }
      
      return errorResponse(res, 'Failed to create booking', 500);
    }
  },

  /**
   * Get My Bookings (for users)
   * GET /api/bookings/my
   */
  getMyBookings: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const query = { userId };
      if (status) {
        query.status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate({ path: 'counsellor', populate: { path: 'user', select: 'name email' } })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Booking.countDocuments(query),
      ]);

      return paginatedResponse(res, bookings, parseInt(page), parseInt(limit), total);
    } catch (error) {
      console.error('Get my bookings error:', error);
      return errorResponse(res, 'Failed to fetch bookings', 500);
    }
  },

  /**
   * Get Booking by ID
   * GET /api/bookings/:id
   */
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email')
        .populate({ path: 'counsellor', populate: { path: 'user', select: 'name email' } });

      if (!booking) {
        return errorResponse(res, 'Booking not found', 404);
      }

      // Check access
      const userId = req.user.id;
      const userRole = req.user.role;
      
      if (userRole === 'user' && booking.userId.toString() !== userId) {
        return errorResponse(res, 'Access denied', 403);
      }

      if (userRole === 'counsellor') {
        const counsellor = await Counsellor.findOne({ userId });
        if (!counsellor || booking.counsellorId.toString() !== counsellor._id.toString()) {
          return errorResponse(res, 'Access denied', 403);
        }
      }

      return successResponse(res, { booking });
    } catch (error) {
      console.error('Get booking error:', error);
      return errorResponse(res, 'Failed to fetch booking', 500);
    }
  },

  /**
   * Cancel Booking (for users)
   * PUT /api/bookings/:id/cancel
   */
  cancelBooking: async (req, res) => {
    try {
      const { cancelReason } = req.body;
      const booking = await Booking.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!booking) {
        return errorResponse(res, 'Booking not found', 404);
      }

      if (['cancelled', 'completed', 'rejected'].includes(booking.status)) {
        return errorResponse(res, `Cannot cancel a ${booking.status} booking`, 400);
      }

      booking.status = 'cancelled';
      booking.cancelReason = cancelReason;
      await booking.save();

      return successResponse(res, { booking }, 'Booking cancelled successfully');
    } catch (error) {
      console.error('Cancel booking error:', error);
      return errorResponse(res, 'Failed to cancel booking', 500);
    }
  },

  /**
   * Update Booking Status (for counsellors)
   * PUT /api/bookings/:id/status
   */
  updateBookingStatus: async (req, res) => {
    try {
      const { status } = req.body;
      
      // Find counsellor profile
      const counsellor = await Counsellor.findOne({ userId: req.user.id });
      if (!counsellor) {
        return errorResponse(res, 'Counsellor profile not found', 404);
      }

      const booking = await Booking.findOne({
        _id: req.params.id,
        counsellorId: counsellor._id,
      });

      if (!booking) {
        return errorResponse(res, 'Booking not found', 404);
      }

      // Validate status transition
      const validTransitions = {
        pending: ['approved', 'rejected'],
        approved: ['completed', 'cancelled'],
      };

      if (!validTransitions[booking.status]?.includes(status)) {
        return errorResponse(res, `Cannot change status from ${booking.status} to ${status}`, 400);
      }

      booking.status = status;
      await booking.save();

      // Update counsellor's total sessions if completed
      if (status === 'completed') {
        counsellor.totalSessions += 1;
        await counsellor.save();
      }

      return successResponse(res, { booking }, 'Booking status updated');
    } catch (error) {
      console.error('Update booking status error:', error);
      return errorResponse(res, 'Failed to update booking status', 500);
    }
  },
};

module.exports = BookingController;
