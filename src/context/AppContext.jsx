import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearSession, now, readSession, readStore, resetStore, uid, writeSession, writeStore } from '../lib/storage';
import { defaultSettings } from '../data/seedData';

const AppContext = createContext(null);

function createLog(userId, action, details) {
  return {
    log_id: uid('log'),
    user_id: userId,
    action,
    details,
    log_date: now(),
  };
}

function createNotification(userId, message) {
  return {
    notification_id: uid('not'),
    user_id: userId,
    message,
    notification_status: 'unread',
    notification_date: now(),
  };
}

function withoutPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function AppProvider({ children }) {
  const [store, setStore] = useState(() => readStore());
  const [session, setSession] = useState(() => readSession());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    writeStore(store);
  }, [store]);

  const currentUser = useMemo(() => {
    if (!session?.user_id) return null;
    return withoutPassword(store.users.find((user) => user.user_id === session.user_id));
  }, [session, store.users]);

  useEffect(() => {
    const theme = store.settings?.theme ?? defaultSettings.theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [store.settings?.theme]);

  function notify(type, message) {
    setToast({ id: Date.now(), type, message });
  }

  function mutate(updater) {
    setStore((current) => {
      const next = updater(current);
      writeStore(next);
      return next;
    });
  }

  function login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const user = store.users.find((item) => item.email.toLowerCase() === cleanEmail);

    if (!user || user.password !== password) {
      notify('error', 'Invalid email or password.');
      return { ok: false };
    }

    if (!user.is_active) {
      notify('error', 'This account is currently deactivated.');
      return { ok: false };
    }

    const nextSession = {
      user_id: user.user_id,
      token: uid('session'),
      login_at: now(),
    };
    writeSession(nextSession);
    setSession(nextSession);
    mutate((current) => ({
      ...current,
      activityLogs: [createLog(user.user_id, 'Login', `${user.username} signed in.`), ...current.activityLogs],
    }));
    notify('success', `Welcome back, ${user.username}.`);
    return { ok: true, role: user.role };
  }

  function register(payload) {
    const email = payload.email.trim().toLowerCase();
    const username = payload.username.trim();

    if (store.users.some((user) => user.email.toLowerCase() === email)) {
      notify('error', 'Email is already registered.');
      return { ok: false };
    }

    const newUser = {
      user_id: uid('usr'),
      username,
      email,
      password: payload.password,
      role: 'user',
      is_active: true,
      created_at: now(),
      updated_at: now(),
    };

    mutate((current) => ({
      ...current,
      users: [newUser, ...current.users],
      activityLogs: [createLog(newUser.user_id, 'Registration', `${username} created an account.`), ...current.activityLogs],
      notifications: [createNotification(newUser.user_id, 'Welcome to QuestLog. Create your first quest to begin.'), ...current.notifications],
    }));
    notify('success', 'Account created. You can now log in.');
    return { ok: true };
  }

  function resetPassword(email, newPassword) {
    const cleanEmail = email.trim().toLowerCase();
    const user = store.users.find((item) => item.email.toLowerCase() === cleanEmail);
    if (!user) {
      notify('error', 'No account was found with that email.');
      return { ok: false };
    }

    mutate((current) => ({
      ...current,
      users: current.users.map((item) =>
        item.user_id === user.user_id ? { ...item, password: newPassword, updated_at: now() } : item,
      ),
      activityLogs: [createLog(user.user_id, 'Password Reset', 'Password was reset from the recovery page.'), ...current.activityLogs],
    }));
    notify('success', 'Password reset complete. Please sign in again.');
    return { ok: true };
  }

  function logout() {
    if (currentUser) {
      mutate((current) => ({
        ...current,
        activityLogs: [createLog(currentUser.user_id, 'Logout', `${currentUser.username} signed out.`), ...current.activityLogs],
      }));
    }
    clearSession();
    setSession(null);
    notify('success', 'Signed out.');
  }

  function createTask(payload) {
    if (!currentUser) return { ok: false };
    const task = {
      task_id: uid('task'),
      user_id: currentUser.user_id,
      title: payload.title.trim(),
      description: payload.description.trim(),
      priority_level: payload.priority_level,
      deadline: payload.deadline,
      status: 'pending',
      created_at: now(),
      updated_at: now(),
    };

    mutate((current) => ({
      ...current,
      tasks: [task, ...current.tasks],
      notifications: [
        createNotification(currentUser.user_id, `${task.title} was added to your quest list.`),
        ...current.notifications,
      ],
      activityLogs: [createLog(currentUser.user_id, 'Task Created', `${task.title} was created.`), ...current.activityLogs],
    }));
    notify('success', 'Task created.');
    return { ok: true };
  }

  function updateTask(taskId, payload) {
    if (!currentUser) return { ok: false };
    const original = store.tasks.find((task) => task.task_id === taskId);
    if (!original || original.user_id !== currentUser.user_id) return { ok: false };

    mutate((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.task_id === taskId
          ? {
              ...task,
              title: payload.title.trim(),
              description: payload.description.trim(),
              priority_level: payload.priority_level,
              deadline: payload.deadline,
              updated_at: now(),
            }
          : task,
      ),
      activityLogs: [createLog(currentUser.user_id, 'Task Updated', `${payload.title} was updated.`), ...current.activityLogs],
    }));
    notify('success', 'Task updated.');
    return { ok: true };
  }

  function deleteTask(taskId) {
    if (!currentUser) return;
    const task = store.tasks.find((item) => item.task_id === taskId);
    if (!task || task.user_id !== currentUser.user_id) return;

    mutate((current) => ({
      ...current,
      tasks: current.tasks.filter((item) => item.task_id !== taskId),
      activityLogs: [createLog(currentUser.user_id, 'Task Deleted', `${task.title} was deleted.`), ...current.activityLogs],
    }));
    notify('success', 'Task deleted.');
  }

  function toggleTaskStatus(taskId) {
    if (!currentUser) return;
    const task = store.tasks.find((item) => item.task_id === taskId);
    if (!task || task.user_id !== currentUser.user_id) return;
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';

    mutate((current) => ({
      ...current,
      tasks: current.tasks.map((item) =>
        item.task_id === taskId ? { ...item, status: nextStatus, updated_at: now() } : item,
      ),
      activityLogs: [
        createLog(
          currentUser.user_id,
          nextStatus === 'completed' ? 'Task Completed' : 'Task Reopened',
          `${task.title} was marked as ${nextStatus}.`,
        ),
        ...current.activityLogs,
      ],
      notifications:
        nextStatus === 'completed'
          ? [createNotification(currentUser.user_id, `${task.title} completed. XP gained.`), ...current.notifications]
          : current.notifications,
    }));
    notify('success', nextStatus === 'completed' ? 'Task completed.' : 'Task returned to pending.');
  }

  function markNotification(notificationId, status = 'read') {
    mutate((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        item.notification_id === notificationId ? { ...item, notification_status: status } : item,
      ),
    }));
  }

  function toggleUserActive(userId) {
    const target = store.users.find((user) => user.user_id === userId);
    if (!currentUser || currentUser.role !== 'admin' || !target || target.role === 'admin') return;
    const nextActive = !target.is_active;

    mutate((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.user_id === userId ? { ...user, is_active: nextActive, updated_at: now() } : user,
      ),
      activityLogs: [
        createLog(currentUser.user_id, nextActive ? 'User Reactivated' : 'User Deactivated', `${target.email} status changed.`),
        ...current.activityLogs,
      ],
    }));
    notify('success', `User ${nextActive ? 'reactivated' : 'deactivated'}.`);
  }

  function updateSettings(nextSettings) {
    mutate((current) => ({
      ...current,
      settings: { ...current.settings, ...nextSettings },
    }));
    notify('success', 'Settings saved.');
  }

  function restoreDemoData() {
    const next = resetStore();
    setStore(next);
    setSession(null);
    notify('success', 'Demo data restored.');
  }

  const value = {
    store,
    currentUser,
    toast,
    setToast,
    login,
    register,
    resetPassword,
    logout,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    markNotification,
    toggleUserActive,
    updateSettings,
    restoreDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
