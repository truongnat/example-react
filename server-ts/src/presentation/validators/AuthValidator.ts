import { body, ValidationChain } from 'express-validator';
import { REGEX_EMAIL, MIN_LENGTH_PASS } from '@shared/constants';

export class AuthValidator {
  static register(): ValidationChain[] {
    return [
      body('username')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Username must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

      body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .matches(REGEX_EMAIL)
        .withMessage('Invalid email format')
        .normalizeEmail(),

      body('password')
        .isLength({ min: MIN_LENGTH_PASS })
        .withMessage(`Password must be at least ${MIN_LENGTH_PASS} characters long`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

      body('avatarUrl')
        .optional()
        .isURL()
        .withMessage('Avatar URL must be a valid URL')
        .isLength({ max: 500 })
        .withMessage('Avatar URL must be less than 500 characters'),
    ];
  }

  static login(): ValidationChain[] {
    return [
      body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

      body('password')
        .notEmpty()
        .withMessage('Password is required'),
    ];
  }

  static forgotPassword(): ValidationChain[] {
    return [
      body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    ];
  }

  static verifyOtp(): ValidationChain[] {
    return [
      body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

      body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits')
        .isNumeric()
        .withMessage('OTP must contain only numbers'),
    ];
  }

  static resetPassword(): ValidationChain[] {
    return [
      body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

      body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits')
        .isNumeric()
        .withMessage('OTP must contain only numbers'),

      body('newPassword')
        .isLength({ min: MIN_LENGTH_PASS })
        .withMessage(`Password must be at least ${MIN_LENGTH_PASS} characters long`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    ];
  }

  static changePassword(): ValidationChain[] {
    return [
      body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

      body('newPassword')
        .isLength({ min: MIN_LENGTH_PASS })
        .withMessage(`Password must be at least ${MIN_LENGTH_PASS} characters long`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    ];
  }

  static refreshToken(): ValidationChain[] {
    return [
      body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isString()
        .withMessage('Refresh token must be a string')
        .isLength({ min: 10 })
        .withMessage('Invalid refresh token format'),
    ];
  }
}
