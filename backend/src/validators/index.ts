import { body } from 'express-validator';
import { UserRole, CounsellorSpecialization } from '../types';

/**
 * Validation rules for authentication endpoints
 */
export const authValidators = {
  signup: [
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),

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
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number'),

    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn([UserRole.STUDENT, UserRole.COUNSELLOR])
      .withMessage('Role must be student or counsellor'),

    body('phone')
      .optional()
      .trim()
      .matches(/^[\d\s\-+()]+$/)
      .withMessage('Please provide a valid phone number'),
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
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),

    body('phone')
      .optional()
      .trim()
      .matches(/^[\d\s\-+()]+$/)
      .withMessage('Please provide a valid phone number'),
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),

    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
  ],
};

/**
 * Validation rules for booking endpoints
 */
export const bookingValidators = {
  create: [
    body('counsellorId')
      .notEmpty()
      .withMessage('Counsellor ID is required')
      .isMongoId()
      .withMessage('Invalid counsellor ID'),

    body('serviceType')
      .notEmpty()
      .withMessage('Service type is required')
      .isIn(Object.values(CounsellorSpecialization))
      .withMessage('Invalid service type'),

    body('date')
      .notEmpty()
      .withMessage('Date is required')
      .isISO8601()
      .withMessage('Invalid date format'),

    body('timeSlot')
      .notEmpty()
      .withMessage('Time slot is required')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('Time slot must be in HH:MM format'),

    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),
  ],

  updateStatus: [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['pending', 'approved', 'rejected', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
  ],
};

/**
 * Validation rules for counsellor endpoints
 */
export const counsellorValidators = {
  updateProfile: [
    body('specializations')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one specialization is required'),

    body('experience')
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage('Experience must be between 0 and 50 years'),

    body('bio')
      .optional()
      .trim()
      .isLength({ min: 50, max: 1000 })
      .withMessage('Bio must be between 50 and 1000 characters'),

    body('hourlyRate')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Hourly rate must be a positive number'),
  ],
};

/**
 * Validation rules for admin endpoints
 */
export const adminValidators = {
  updateUserStatus: [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['active', 'inactive', 'blocked', 'pending'])
      .withMessage('Invalid status'),
  ],

  verifyCounsellor: [
    body('isVerified')
      .notEmpty()
      .withMessage('Verification status is required')
      .isBoolean()
      .withMessage('isVerified must be a boolean'),

    body('rejectionReason')
      .if(body('isVerified').equals('false'))
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Rejection reason cannot exceed 500 characters'),
  ],
};
