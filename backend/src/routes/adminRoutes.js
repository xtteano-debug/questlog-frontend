import { Router } from 'express';
import { body, param } from 'express-validator';
import { listActivityLogs, listUsers, setUserActive } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/users', asyncHandler(listUsers));
router.patch(
  '/users/:userId/status',
  [
    param('userId').isUUID().withMessage('Valid user id is required.'),
    body('is_active').isBoolean().withMessage('is_active must be true or false.'),
    validate,
  ],
  asyncHandler(setUserActive),
);
router.get('/logs', asyncHandler(listActivityLogs));

export default router;
