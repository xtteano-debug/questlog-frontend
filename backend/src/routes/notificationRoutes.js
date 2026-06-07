import { Router } from 'express';
import { body, param } from 'express-validator';
import { listNotifications, updateNotificationStatus } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(listNotifications));
router.patch(
  '/:notificationId',
  [
    param('notificationId').isUUID().withMessage('Valid notification id is required.'),
    body('notification_status').isIn(['read', 'unread']).withMessage('Status must be read or unread.'),
    validate,
  ],
  asyncHandler(updateNotificationStatus),
);

export default router;
