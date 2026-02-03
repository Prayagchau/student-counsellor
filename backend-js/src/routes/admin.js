const express = require('express');
const { AdminController } = require('../controllers');
const { authenticate, authorize, validate } = require('../middlewares');
const { adminValidators } = require('../validators');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform statistics
 * @access  Admin only
 */
router.get('/stats', AdminController.getStats);

/**
 * @route   GET /api/admin/users
 * @desc    List all users (with pagination & search)
 * @access  Admin only
 */
router.get('/users', AdminController.getUsers);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Update user status (activate/deactivate)
 * @access  Admin only
 */
router.put(
  '/users/:id/status',
  validate(adminValidators.updateUserStatus),
  AdminController.updateUserStatus
);

/**
 * @route   GET /api/admin/counsellors
 * @desc    List all counsellors
 * @access  Admin only
 */
router.get('/counsellors', AdminController.getCounsellors);

/**
 * @route   PUT /api/admin/counsellors/:id/approve
 * @desc    Approve or reject counsellor
 * @access  Admin only
 */
router.put(
  '/counsellors/:id/approve',
  validate(adminValidators.verifyCounsellor),
  AdminController.approveCounsellor
);

/**
 * @route   GET /api/admin/bookings
 * @desc    List all bookings
 * @access  Admin only
 */
router.get('/bookings', AdminController.getAllBookings);

module.exports = router;
