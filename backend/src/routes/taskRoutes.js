import { Router } from 'express';
import { body, param } from 'express-validator';
import { createTask, deleteTask, listTasks, setTaskStatus, updateTask } from '../controllers/taskController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const taskRules = [
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('Title must be 2 to 120 characters.'),
  body('description').trim().isLength({ min: 2, max: 1000 }).withMessage('Description must be 2 to 1000 characters.'),
  body('priority_level').isIn(['easy', 'medium', 'hard']).withMessage('Priority must be easy, medium, or hard.'),
  body('deadline').isISO8601({ strict: true }).withMessage('Valid deadline date is required.'),
];

router.use(authenticate, authorize('user'));

router.get('/', asyncHandler(listTasks));
router.post('/', [...taskRules, validate], asyncHandler(createTask));
router.put('/:taskId', [param('taskId').isUUID().withMessage('Valid task id is required.'), ...taskRules, validate], asyncHandler(updateTask));
router.delete('/:taskId', [param('taskId').isUUID().withMessage('Valid task id is required.'), validate], asyncHandler(deleteTask));
router.patch(
  '/:taskId/status',
  [
    param('taskId').isUUID().withMessage('Valid task id is required.'),
    body('status').isIn(['pending', 'completed']).withMessage('Status must be pending or completed.'),
    validate,
  ],
  asyncHandler(setTaskStatus),
);

export default router;
