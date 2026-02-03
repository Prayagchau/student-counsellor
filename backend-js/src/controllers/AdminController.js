const { User, Counsellor, Booking } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Admin Controller
 */
const AdminController = {
  /**
   * Get Platform Statistics
   * GET /api/admin/stats
   */
  getStats: async (req, res) => {
    try {
      const [
        totalUsers,
        totalCounsellors,
        approvedCounsellors,
        pendingCounsellors,
        totalBookings,
        pendingBookings,
        completedBookings,
      ] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        Counsellor.countDocuments(),
        Counsellor.countDocuments({ approved: true }),
        Counsellor.countDocuments({ approved: false }),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'pending' }),
        Booking.countDocuments({ status: 'completed' }),
      ]);

      return successResponse(res, {
        users: {
          total: totalUsers,
        },
        counsellors: {
          total: totalCounsellors,
          approved: approvedCounsellors,
          pending: pendingCounsellors,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          completed: completedBookings,
        },
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return errorResponse(res, 'Failed to fetch statistics', 500);
    }
  },

  /**
   * Get All Users
   * GET /api/admin/users
   */
  getUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, role } = req.query;

      const query = {};
      if (role) {
        query.role = role;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [users, total] = await Promise.all([
        User.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        User.countDocuments(query),
      ]);

      return paginatedResponse(
        res,
        users.map((u) => u.toPublicJSON()),
        parseInt(page),
        parseInt(limit),
        total
      );
    } catch (error) {
      console.error('Get users error:', error);
      return errorResponse(res, 'Failed to fetch users', 500);
    }
  },

  /**
   * Update User Status
   * PUT /api/admin/users/:id/status
   */
  updateUserStatus: async (req, res) => {
    try {
      const { isActive } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      );

      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      return successResponse(res, { user: user.toPublicJSON() }, 'User status updated');
    } catch (error) {
      console.error('Update user status error:', error);
      return errorResponse(res, 'Failed to update user status', 500);
    }
  },

  /**
   * Get All Counsellors
   * GET /api/admin/counsellors
   */
  getCounsellors: async (req, res) => {
    try {
      const { page = 1, limit = 10, approved } = req.query;

      const query = {};
      if (approved !== undefined) {
        query.approved = approved === 'true';
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [counsellors, total] = await Promise.all([
        Counsellor.find(query)
          .populate('user', 'name email isActive createdAt')
          .sort({ createdAt: -1 })
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
   * Approve/Reject Counsellor
   * PUT /api/admin/counsellors/:id/approve
   */
  approveCounsellor: async (req, res) => {
    try {
      const { approved } = req.body;

      const counsellor = await Counsellor.findByIdAndUpdate(
        req.params.id,
        { approved },
        { new: true }
      ).populate('user', 'name email');

      if (!counsellor) {
        return errorResponse(res, 'Counsellor not found', 404);
      }

      return successResponse(
        res,
        { counsellor },
        approved ? 'Counsellor approved' : 'Counsellor rejected'
      );
    } catch (error) {
      console.error('Approve counsellor error:', error);
      return errorResponse(res, 'Failed to update counsellor', 500);
    }
  },

  /**
   * Get All Bookings
   * GET /api/admin/bookings
   */
  getAllBookings: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const query = {};
      if (status) {
        query.status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('user', 'name email')
          .populate({ path: 'counsellor', populate: { path: 'user', select: 'name email' } })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Booking.countDocuments(query),
      ]);

      return paginatedResponse(res, bookings, parseInt(page), parseInt(limit), total);
    } catch (error) {
      console.error('Get all bookings error:', error);
      return errorResponse(res, 'Failed to fetch bookings', 500);
    }
  },
};

module.exports = AdminController;
