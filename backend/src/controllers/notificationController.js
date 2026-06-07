import { pool } from '../config/db.js';

export async function listNotifications(req, res) {
  const isAdmin = req.user.role === 'admin';
  const [rows] = isAdmin
    ? await pool.execute(
        `SELECT notification_id, user_id, message, notification_status, notification_date
         FROM notifications
         ORDER BY notification_date DESC`,
      )
    : await pool.execute(
        `SELECT notification_id, user_id, message, notification_status, notification_date
         FROM notifications
         WHERE user_id = ?
         ORDER BY notification_date DESC`,
        [req.user.user_id],
      );

  return res.json({ notifications: rows });
}

export async function updateNotificationStatus(req, res) {
  const isAdmin = req.user.role === 'admin';
  const params = isAdmin
    ? [req.body.notification_status, req.params.notificationId]
    : [req.body.notification_status, req.params.notificationId, req.user.user_id];
  const sql = isAdmin
    ? `UPDATE notifications SET notification_status = ? WHERE notification_id = ?`
    : `UPDATE notifications SET notification_status = ? WHERE notification_id = ? AND user_id = ?`;

  const [result] = await pool.execute(sql, params);
  if (!result.affectedRows) {
    return res.status(404).json({ message: 'Notification not found.' });
  }

  return res.json({ message: 'Notification updated.' });
}
