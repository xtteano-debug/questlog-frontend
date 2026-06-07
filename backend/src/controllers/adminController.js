import { pool } from '../config/db.js';
import { createActivityLog } from '../services/logService.js';

export async function listUsers(req, res) {
  const [rows] = await pool.execute(
    `SELECT user_id, username, email, role, is_active, created_at, updated_at
     FROM users
     ORDER BY created_at DESC`,
  );

  return res.json({ users: rows });
}

export async function setUserActive(req, res) {
  const [rows] = await pool.execute(`SELECT user_id, email, role FROM users WHERE user_id = ?`, [req.params.userId]);
  const target = rows[0];

  if (!target) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (target.role === 'admin') {
    return res.status(400).json({ message: 'Admin accounts cannot be deactivated from this screen.' });
  }

  await pool.execute(`UPDATE users SET is_active = ? WHERE user_id = ?`, [req.body.is_active, req.params.userId]);
  await createActivityLog(
    req.user.user_id,
    req.body.is_active ? 'User Reactivated' : 'User Deactivated',
    `${target.email} status changed.`,
  );

  return res.json({ message: 'User status updated.' });
}

export async function listActivityLogs(req, res) {
  const [rows] = await pool.execute(
    `SELECT log_id, user_id, action, details, log_date
     FROM activity_logs
     ORDER BY log_date DESC
     LIMIT 200`,
  );

  return res.json({ activityLogs: rows });
}
