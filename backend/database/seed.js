import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { pool } from '../src/config/db.js';
import { env } from '../src/config/env.js';

const ids = {
  admin: '11111111-1111-4111-8111-111111111111',
  demo: '22222222-2222-4222-8222-222222222222',
  lina: '33333333-3333-4333-8333-333333333333',
};

async function seed() {
  const adminHash = await bcrypt.hash('admin1234', env.bcryptSaltRounds);
  const demoHash = await bcrypt.hash('demo1234', env.bcryptSaltRounds);

  await pool.execute(`DELETE FROM activity_logs`);
  await pool.execute(`DELETE FROM notifications`);
  await pool.execute(`DELETE FROM tasks`);
  await pool.execute(`DELETE FROM users`);

  await pool.execute(
    `INSERT INTO users (user_id, username, email, password_hash, role, is_active)
     VALUES
     (?, 'Admin', 'admin@questlog.test', ?, 'admin', TRUE),
     (?, 'Demo Player', 'demo@questlog.test', ?, 'user', TRUE),
     (?, 'Lina Cruz', 'lina@questlog.test', ?, 'user', FALSE)`,
    [ids.admin, adminHash, ids.demo, demoHash, ids.lina, demoHash],
  );

  await pool.execute(
    `INSERT INTO tasks (task_id, user_id, title, description, priority_level, deadline, status)
     VALUES
     (?, ?, 'Finalize SRS chapter', 'Review functional requirements and format the document for submission.', 'hard', '2026-06-10', 'pending'),
     (?, ?, 'Design dashboard mockup', 'Create a clean task board layout with progress indicators.', 'medium', '2026-06-08', 'completed'),
     (?, ?, 'Prepare presentation notes', 'Summarize features, user flows, and deployment steps.', 'easy', '2026-06-06', 'pending')`,
    [randomUUID(), ids.demo, randomUUID(), ids.demo, randomUUID(), ids.demo],
  );

  await pool.execute(
    `INSERT INTO notifications (notification_id, user_id, message, notification_status)
     VALUES
     (?, ?, 'Prepare presentation notes is overdue.', 'unread'),
     (?, ?, 'Finalize SRS chapter is a high priority quest.', 'unread')`,
    [randomUUID(), ids.demo, randomUUID(), ids.demo],
  );

  await pool.execute(
    `INSERT INTO activity_logs (log_id, user_id, action, details)
     VALUES
     (?, ?, 'Seed', 'Demo data was installed.'),
     (?, ?, 'Admin Review', 'System activity dashboard opened.')`,
    [randomUUID(), ids.demo, randomUUID(), ids.admin],
  );

  await pool.end();
  console.log('QuestLog database seeded.');
}

seed().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
