import { randomUUID } from 'crypto';
import { pool } from '../config/db.js';

export async function createActivityLog(userId, action, details) {
  await pool.execute(
    `INSERT INTO activity_logs (log_id, user_id, action, details)
     VALUES (?, ?, ?, ?)`,
    [randomUUID(), userId, action, details],
  );
}

export async function createNotification(userId, message) {
  await pool.execute(
    `INSERT INTO notifications (notification_id, user_id, message, notification_status)
     VALUES (?, ?, ?, 'unread')`,
    [randomUUID(), userId, message],
  );
}
