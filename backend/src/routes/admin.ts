import { Router } from 'express';
import { AdminController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { validate } from '../middlewares';
import { adminValidators } from '../validators';
import { UserRole } from '../types';

const router = Router();

/**
 * All admin routes require authentication and admin role
 */
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform statistics
 * @access  Admin only
 */
router.get('/stats', AdminController.getStats);

/**
 * @route   GET /api/admin/users
 * @desc    List all users
 * @access  Admin only
 */
router.get('/users', AdminController.getUsers);

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Update user status
 * @access  Admin only
 */
router.patch(
  '/users/:id/status',
  validate(adminValidators.updateUserStatus),
  AdminController.updateUserStatus
);

/**
 * @route   GET /api/admin/counsellors/pending
 * @desc    List pending counsellors
 * @access  Admin only
 */
router.get('/counsellors/pending', AdminController.getPendingCounsellors);

/**
 * @route   PATCH /api/admin/counsellors/:id/verify
 * @desc    Verify or reject counsellor
 * @access  Admin only
 */
router.patch(
  '/counsellors/:id/verify',
  validate(adminValidators.verifyCounsellor),
  AdminController.verifyCounsellor
);

/**
 * @route   GET /api/admin/bookings
 * @desc    List all bookings
 * @access  Admin only
 */
router.get('/bookings', AdminController.getAllBookings);

export default router;
