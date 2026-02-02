import { Router } from 'express';
import { CounsellorController } from '../controllers';
import { authenticate, authorize, optionalAuth } from '../middlewares';
import { validate } from '../middlewares';
import { counsellorValidators } from '../validators';
import { UserRole } from '../types';

const router = Router();

/**
 * @route   GET /api/counsellors
 * @desc    List all verified counsellors
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
  authorize(UserRole.COUNSELLOR),
  CounsellorController.getMyProfile
);

/**
 * @route   GET /api/counsellors/:id
 * @desc    Get counsellor by ID
 * @access  Public
 */
router.get('/:id', optionalAuth, CounsellorController.getCounsellorById);

/**
 * @route   PUT /api/counsellors/profile
 * @desc    Update counsellor profile
 * @access  Private (Counsellors only)
 */
router.put(
  '/profile',
  authenticate,
  authorize(UserRole.COUNSELLOR),
  validate(counsellorValidators.updateProfile),
  CounsellorController.updateProfile
);

export default router;
