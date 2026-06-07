import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { createActivityLog, createNotification } from '../services/logService.js';
import { signToken } from '../utils/tokens.js';

function publicUser(user) {
  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
    is_active: Boolean(user.is_active),
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export async function register(req, res) {
  const username = req.body.username.trim();
  const email = req.body.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(req.body.password, env.bcryptSaltRounds);
  const userId = randomUUID();

  try {
    await pool.execute(
      `INSERT INTO users (user_id, username, email, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, 'user', TRUE)`,
      [userId, username, email, passwordHash],
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email is already registered.' });
    }
    throw error;
  }

  await createActivityLog(userId, 'Registration', `${username} created an account.`);
  await createNotification(userId, 'Welcome to QuestLog. Create your first quest to begin.');

  return res.status(201).json({ message: 'Account created.' });
}

export async function login(req, res) {
  const email = req.body.email.trim().toLowerCase();
  const [rows] = await pool.execute(
    `SELECT user_id, username, email, password_hash, role, is_active, created_at, updated_at
     FROM users
     WHERE email = ?`,
    [email],
  );

  const user = rows[0];
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(req.body.password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (!user.is_active) {
    return res.status(403).json({ message: 'This account is currently deactivated.' });
  }

  await createActivityLog(user.user_id, 'Login', `${user.username} signed in.`);

  return res.json({
    token: signToken(user),
    user: publicUser(user),
  });
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export async function resetPassword(req, res) {
  const email = req.body.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(req.body.password, env.bcryptSaltRounds);
  const [rows] = await pool.execute(`SELECT user_id FROM users WHERE email = ?`, [email]);
  const user = rows[0];

  if (!user) {
    return res.status(404).json({ message: 'No account was found with that email.' });
  }

  await pool.execute(`UPDATE users SET password_hash = ? WHERE user_id = ?`, [passwordHash, user.user_id]);
  await createActivityLog(user.user_id, 'Password Reset', 'Password was reset from the recovery page.');

  return res.json({ message: 'Password reset complete.' });
}

export async function logout(req, res) {
  await createActivityLog(req.user.user_id, 'Logout', `${req.user.username} signed out.`);
  return res.json({ message: 'Signed out.' });
}
