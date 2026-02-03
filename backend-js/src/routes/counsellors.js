const express = require('express');
const { CounsellorController } = require('../controllers');
const { authenticate, authorize, optionalAuth, validate } = require('../middlewares');
const { counsellorValidators } = require('../validators');

const router = express.Router();

/**
 * @route   GET /api/counsellors
 * @desc    List all approved counsellors
 * @access  Public
 */
router.get('/', optionalAuth, CounsellorController.getCounsellors);

/**
 * @route   GET /api/counsellors/me
 * @desc    Get current counsellor's profile
 * @access  Private (Counsellors only)
 */
router.get(
  '/me',
  authenticate,
  authorize('counsellor'),
  CounsellorController.getMyProfile
);

/**
 * @route   GET /api/counsellors/bookings
 * @desc    Get counsellor's bookings
 * @access  Private (Counsellors only)
 */
router.get(
  '/bookings',
  authenticate,
  authorize('counsellor'),
  CounsellorController.getMyBookings
);

/**
 * @route   GET /api/counsellors/:id
 * @desc    Get counsellor by ID
 * @access  Public
 */
router.get('/:id', optionalAuth, CounsellorController.getCounsellorById);

/**
 * @route   POST /api/counsellors/profile
 * @desc    Create or update counsellor profile
 * @access  Private (Counsellors only)
 */
router.post(
  '/profile',
  authenticate,
  authorize('counsellor'),
  validate(counsellorValidators.createProfile),
  CounsellorController.createOrUpdateProfile
);

module.exports = router;
