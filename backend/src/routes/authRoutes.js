import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, me, register, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const passwordRule = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long.');

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 2, max: 80 }).withMessage('Username must be 2 to 80 characters.'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required.'),
    passwordRule,
    validate,
  ],
  asyncHandler(register),
);

router.post(
  '/login',
  [body('email').trim().isEmail().withMessage('Valid email is required.'), passwordRule, validate],
  asyncHandler(login),
);

router.get('/me', authenticate, asyncHandler(me));

router.post(
  '/reset-password',
  [body('email').trim().isEmail().withMessage('Valid email is required.'), passwordRule, validate],
  asyncHandler(resetPassword),
);

router.post('/logout', authenticate, asyncHandler(logout));

export default router;
