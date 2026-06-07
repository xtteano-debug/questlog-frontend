import { randomUUID } from 'crypto';
import { pool } from '../config/db.js';
import { createActivityLog, createNotification } from '../services/logService.js';

export async function listTasks(req, res) {
  const [rows] = await pool.execute(
    `SELECT task_id, user_id, title, description, priority_level, DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline,
            status, created_at, updated_at
     FROM tasks
     WHERE user_id = ?
     ORDER BY deadline ASC, created_at DESC`,
    [req.user.user_id],
  );

  return res.json({ tasks: rows });
}

export async function createTask(req, res) {
  const taskId = randomUUID();
  const title = req.body.title.trim();

  await pool.execute(
    `INSERT INTO tasks (task_id, user_id, title, description, priority_level, deadline, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [taskId, req.user.user_id, title, req.body.description.trim(), req.body.priority_level, req.body.deadline],
  );

  await createNotification(req.user.user_id, `${title} was added to your quest list.`);
  await createActivityLog(req.user.user_id, 'Task Created', `${title} was created.`);

  const [rows] = await pool.execute(
    `SELECT task_id, user_id, title, description, priority_level, DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline,
            status, created_at, updated_at
     FROM tasks
     WHERE task_id = ?`,
    [taskId],
  );

  return res.status(201).json({ task: rows[0] });
}

export async function updateTask(req, res) {
  const [existingRows] = await pool.execute(`SELECT task_id FROM tasks WHERE task_id = ? AND user_id = ?`, [
    req.params.taskId,
    req.user.user_id,
  ]);

  if (!existingRows[0]) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  await pool.execute(
    `UPDATE tasks
     SET title = ?, description = ?, priority_level = ?, deadline = ?
     WHERE task_id = ? AND user_id = ?`,
    [
      req.body.title.trim(),
      req.body.description.trim(),
      req.body.priority_level,
      req.body.deadline,
      req.params.taskId,
      req.user.user_id,
    ],
  );

  await createActivityLog(req.user.user_id, 'Task Updated', `${req.body.title.trim()} was updated.`);

  const [rows] = await pool.execute(
    `SELECT task_id, user_id, title, description, priority_level, DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline,
            status, created_at, updated_at
     FROM tasks
     WHERE task_id = ?`,
    [req.params.taskId],
  );

  return res.json({ task: rows[0] });
}

export async function deleteTask(req, res) {
  const [rows] = await pool.execute(`SELECT title FROM tasks WHERE task_id = ? AND user_id = ?`, [
    req.params.taskId,
    req.user.user_id,
  ]);

  const task = rows[0];
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  await pool.execute(`DELETE FROM tasks WHERE task_id = ? AND user_id = ?`, [req.params.taskId, req.user.user_id]);
  await createActivityLog(req.user.user_id, 'Task Deleted', `${task.title} was deleted.`);

  return res.json({ message: 'Task deleted.' });
}

export async function setTaskStatus(req, res) {
  const [rows] = await pool.execute(`SELECT title, status FROM tasks WHERE task_id = ? AND user_id = ?`, [
    req.params.taskId,
    req.user.user_id,
  ]);

  const task = rows[0];
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  await pool.execute(`UPDATE tasks SET status = ? WHERE task_id = ? AND user_id = ?`, [
    req.body.status,
    req.params.taskId,
    req.user.user_id,
  ]);

  await createActivityLog(
    req.user.user_id,
    req.body.status === 'completed' ? 'Task Completed' : 'Task Reopened',
    `${task.title} was marked as ${req.body.status}.`,
  );

  if (req.body.status === 'completed') {
    await createNotification(req.user.user_id, `${task.title} completed. XP gained.`);
  }

  const [updatedRows] = await pool.execute(
    `SELECT task_id, user_id, title, description, priority_level, DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline,
            status, created_at, updated_at
     FROM tasks
     WHERE task_id = ?`,
    [req.params.taskId],
  );

  return res.json({ task: updatedRows[0] });
}
