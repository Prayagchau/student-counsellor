import { Router } from 'express';
import { AuthController } from '../controllers';
import { authenticate } from '../middlewares';
import { validate } from '../middlewares';
import { authValidators } from '../validators';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/signup',
  validate(authValidators.signup),
  AuthController.signup
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  validate(authValidators.login),
  AuthController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  validate(authValidators.updateProfile),
  AuthController.updateProfile
);

/**
 * @route   PUT /api/auth/password
 * @desc    Change password
 * @access  Private
 */
router.put(
  '/password',
  authenticate,
  validate(authValidators.changePassword),
  AuthController.changePassword
);

export default router;
