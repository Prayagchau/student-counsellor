const { body } = require('express-validator');

/**
 * Auth Validators
 */
const authValidators = {
  signup: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['user', 'counsellor'])
      .withMessage('Invalid role'),
  ],
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),
  ],
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
};

/**
 * Booking Validators
 */
const bookingValidators = {
  create: [
    body('counsellorId')
      .notEmpty()
      .withMessage('Counsellor ID is required')
      .isMongoId()
      .withMessage('Invalid counsellor ID'),
    body('bookingDate')
      .notEmpty()
      .withMessage('Booking date is required')
      .isISO8601()
      .withMessage('Invalid date format'),
    body('timeSlot')
      .notEmpty()
      .withMessage('Time slot is required')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Invalid time format (HH:MM)'),
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),
  ],
  updateStatus: [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['approved', 'rejected', 'cancelled', 'completed'])
      .withMessage('Invalid status'),
  ],
  cancel: [
    body('cancelReason')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Cancel reason cannot exceed 500 characters'),
  ],
};

/**
 * Counsellor Validators
 */
const counsellorValidators = {
  createProfile: [
    body('qualification')
      .trim()
      .notEmpty()
      .withMessage('Qualification is required')
      .isLength({ max: 200 })
      .withMessage('Qualification cannot exceed 200 characters'),
    body('specialization')
      .isArray({ min: 1 })
      .withMessage('At least one specialization is required'),
    body('experience')
      .notEmpty()
      .withMessage('Experience is required')
      .isInt({ min: 0, max: 50 })
      .withMessage('Experience must be between 0 and 50 years'),
    body('bio')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Bio cannot exceed 2000 characters'),
    body('hourlyRate')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Hourly rate must be positive'),
  ],
  updateProfile: [
    body('qualification')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Qualification cannot exceed 200 characters'),
    body('specialization')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one specialization is required'),
    body('experience')
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage('Experience must be between 0 and 50 years'),
    body('bio')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Bio cannot exceed 2000 characters'),
    body('hourlyRate')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Hourly rate must be positive'),
  ],
};

/**
 * Admin Validators
 */
const adminValidators = {
  updateUserStatus: [
    body('isActive')
      .notEmpty()
      .withMessage('Status is required')
      .isBoolean()
      .withMessage('Status must be a boolean'),
  ],
  verifyCounsellor: [
    body('approved')
      .notEmpty()
      .withMessage('Approval status is required')
      .isBoolean()
      .withMessage('Approved must be a boolean'),
  ],
};

module.exports = {
  authValidators,
  bookingValidators,
  counsellorValidators,
  adminValidators,
};
