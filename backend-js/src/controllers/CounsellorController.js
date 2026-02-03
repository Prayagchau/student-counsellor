const { Counsellor, Booking } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Counsellor Controller
 */
const CounsellorController = {
  /**
   * Get All Approved Counsellors
   * GET /api/counsellors
   */
  getCounsellors: async (req, res) => {
    try {
      const { page = 1, limit = 10, specialization } = req.query;
      
      const query = { approved: true };
      if (specialization) {
        query.specialization = { $in: [specialization] };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [counsellors, total] = await Promise.all([
        Counsellor.find(query)
          .populate('user', 'name email')
          .sort({ rating: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Counsellor.countDocuments(query),
      ]);

      return paginatedResponse(res, counsellors, parseInt(page), parseInt(limit), total);
    } catch (error) {
      console.error('Get counsellors error:', error);
      return errorResponse(res, 'Failed to fetch counsellors', 500);
    }
  },

  /**
   * Get Counsellor by ID
   * GET /api/counsellors/:id
   */
  getCounsellorById: async (req, res) => {
    try {
      const counsellor = await Counsellor.findById(req.params.id)
        .populate('user', 'name email');

      if (!counsellor) {
        return errorResponse(res, 'Counsellor not found', 404);
      }

      // Only show approved counsellors to public
      if (!counsellor.approved && (!req.user || req.user.role !== 'admin')) {
        return errorResponse(res, 'Counsellor not found', 404);
      }

      return successResponse(res, { counsellor });
    } catch (error) {
      console.error('Get counsellor error:', error);
      return errorResponse(res, 'Failed to fetch counsellor', 500);
    }
  },

  /**
   * Create/Update Counsellor Profile
   * POST /api/counsellors/profile
   */
  createOrUpdateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { qualification, specialization, experience, bio, hourlyRate, availabilitySlots } = req.body;

      let counsellor = await Counsellor.findOne({ userId });

      if (counsellor) {
        // Update existing
        Object.assign(counsellor, {
          qualification: qualification || counsellor.qualification,
          specialization: specialization || counsellor.specialization,
          experience: experience !== undefined ? experience : counsellor.experience,
          bio: bio !== undefined ? bio : counsellor.bio,
          hourlyRate: hourlyRate !== undefined ? hourlyRate : counsellor.hourlyRate,
          availabilitySlots: availabilitySlots || counsellor.availabilitySlots,
        });
        await counsellor.save();
      } else {
        // Create new
        counsellor = await Counsellor.create({
          userId,
          qualification,
          specialization,
          experience,
          bio,
          hourlyRate,
          availabilitySlots,
          approved: false,
        });
      }

      return successResponse(res, { counsellor }, 'Profile updated successfully');
    } catch (error) {
      console.error('Update counsellor profile error:', error);
      return errorResponse(res, 'Failed to update profile', 500);
    }
  },

  /**
   * Get My Profile (for counsellors)
   * GET /api/counsellors/me
   */
  getMyProfile: async (req, res) => {
    try {
      const counsellor = await Counsellor.findOne({ userId: req.user.id })
        .populate('user', 'name email');

      if (!counsellor) {
        return errorResponse(res, 'Counsellor profile not found', 404);
      }

      return successResponse(res, { counsellor });
    } catch (error) {
      console.error('Get my profile error:', error);
      return errorResponse(res, 'Failed to fetch profile', 500);
    }
  },

  /**
   * Get Counsellor's Bookings
   * GET /api/counsellors/bookings
   */
  getMyBookings: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const counsellor = await Counsellor.findOne({ userId: req.user.id });
      if (!counsellor) {
        return errorResponse(res, 'Counsellor profile not found', 404);
      }

      const query = { counsellorId: counsellor._id };
      if (status) {
        query.status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('user', 'name email')
          .sort({ bookingDate: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Booking.countDocuments(query),
      ]);

      return paginatedResponse(res, bookings, parseInt(page), parseInt(limit), total);
    } catch (error) {
      console.error('Get counsellor bookings error:', error);
      return errorResponse(res, 'Failed to fetch bookings', 500);
    }
  },
};

module.exports = CounsellorController;
