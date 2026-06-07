export const priorities = ['easy', 'medium', 'hard'];
export const taskStatuses = ['pending', 'completed'];
export const notificationStatuses = ['unread', 'read'];

export const defaultSettings = {
  theme: 'light',
  compactMode: false,
  deadlineReminders: true,
  weeklySummary: true,
};

export const seedUsers = [
  {
    user_id: 'usr-admin-001',
    username: 'Admin',
    email: 'admin@questlog.test',
    password: 'admin1234',
    role: 'admin',
    is_active: true,
    created_at: '2026-06-01T08:00:00.000Z',
    updated_at: '2026-06-01T08:00:00.000Z',
  },
  {
    user_id: 'usr-demo-001',
    username: 'Demo Player',
    email: 'demo@questlog.test',
    password: 'demo1234',
    role: 'user',
    is_active: true,
    created_at: '2026-06-02T09:30:00.000Z',
    updated_at: '2026-06-02T09:30:00.000Z',
  },
  {
    user_id: 'usr-lina-002',
    username: 'Lina Cruz',
    email: 'lina@questlog.test',
    password: 'demo1234',
    role: 'user',
    is_active: false,
    created_at: '2026-06-03T12:20:00.000Z',
    updated_at: '2026-06-05T07:15:00.000Z',
  },
];

export const seedTasks = [
  {
    task_id: 'task-001',
    user_id: 'usr-demo-001',
    title: 'Finalize SRS chapter',
    description: 'Review functional requirements and format the document for submission.',
    priority_level: 'hard',
    deadline: '2026-06-10',
    status: 'pending',
    created_at: '2026-06-03T10:00:00.000Z',
    updated_at: '2026-06-03T10:00:00.000Z',
  },
  {
    task_id: 'task-002',
    user_id: 'usr-demo-001',
    title: 'Design dashboard mockup',
    description: 'Create a clean task board layout with progress indicators.',
    priority_level: 'medium',
    deadline: '2026-06-08',
    status: 'completed',
    created_at: '2026-06-02T14:25:00.000Z',
    updated_at: '2026-06-06T11:30:00.000Z',
  },
  {
    task_id: 'task-003',
    user_id: 'usr-demo-001',
    title: 'Prepare presentation notes',
    description: 'Summarize features, user flows, and deployment steps.',
    priority_level: 'easy',
    deadline: '2026-06-06',
    status: 'pending',
    created_at: '2026-06-04T16:10:00.000Z',
    updated_at: '2026-06-04T16:10:00.000Z',
  },
];

export const seedNotifications = [
  {
    notification_id: 'not-001',
    user_id: 'usr-demo-001',
    message: 'Prepare presentation notes is overdue.',
    notification_status: 'unread',
    notification_date: '2026-06-07T08:00:00.000Z',
  },
  {
    notification_id: 'not-002',
    user_id: 'usr-demo-001',
    message: 'Finalize SRS chapter is a high priority quest.',
    notification_status: 'unread',
    notification_date: '2026-06-06T12:00:00.000Z',
  },
];

export const seedLogs = [
  {
    log_id: 'log-001',
    user_id: 'usr-demo-001',
    action: 'Task Completed',
    details: 'Design dashboard mockup marked as completed.',
    log_date: '2026-06-06T11:30:00.000Z',
  },
  {
    log_id: 'log-002',
    user_id: 'usr-admin-001',
    action: 'Admin Review',
    details: 'System activity dashboard opened.',
    log_date: '2026-06-06T15:42:00.000Z',
  },
];

export const initialStore = {
  users: seedUsers,
  tasks: seedTasks,
  notifications: seedNotifications,
  activityLogs: seedLogs,
  settings: defaultSettings,
};
