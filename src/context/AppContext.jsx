import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { defaultSettings } from '../data/seedData';
import { api, clearToken, getErrorMessage, readToken, saveToken } from '../lib/api';

const AppContext = createContext(null);
const SETTINGS_KEY = 'questlog_settings_v1';

function readSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;

  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function AppProvider({ children }) {
  const [store, setStore] = useState({
    users: [],
    tasks: [],
    notifications: [],
    activityLogs: [],
    settings: readSettings(),
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(readToken()));
  const [toast, setToast] = useState(null);

  function notify(type, message) {
    setToast({ id: Date.now(), type, message });
  }

  const loadUserData = useCallback(async (user) => {
    if (!user) return;

    if (user.role === 'admin') {
      const [usersRes, notificationsRes, logsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/notifications'),
        api.get('/admin/logs'),
      ]);

      setStore((current) => ({
        ...current,
        users: usersRes.data.users,
        notifications: notificationsRes.data.notifications,
        activityLogs: logsRes.data.activityLogs,
        tasks: [],
      }));
      return;
    }

    const [tasksRes, notificationsRes] = await Promise.all([api.get('/tasks'), api.get('/notifications')]);
    setStore((current) => ({
      ...current,
      tasks: tasksRes.data.tasks,
      notifications: notificationsRes.data.notifications,
      users: [user],
      activityLogs: [],
    }));
  }, []);

  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    await loadUserData(currentUser);
  }, [currentUser, loadUserData]);

  useEffect(() => {
    const theme = store.settings?.theme ?? defaultSettings.theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(store.settings));
  }, [store.settings]);

  useEffect(() => {
    async function bootstrap() {
      const token = readToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setCurrentUser(response.data.user);
        await loadUserData(response.data.user);
      } catch {
        clearToken();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [loadUserData]);

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      saveToken(response.data.token);
      setCurrentUser(response.data.user);
      await loadUserData(response.data.user);
      notify('success', `Welcome back, ${response.data.user.username}.`);
      return { ok: true, role: response.data.user.role };
    } catch (error) {
      notify('error', getErrorMessage(error));
      return { ok: false };
    }
  }

  async function register(payload) {
    try {
      await api.post('/auth/register', payload);
      notify('success', 'Account created. You can now log in.');
      return { ok: true };
    } catch (error) {
      notify('error', getErrorMessage(error));
      return { ok: false };
    }
  }

  async function resetPassword(email, password) {
    try {
      await api.post('/auth/reset-password', { email, password });
      notify('success', 'Password reset complete. Please sign in again.');
      return { ok: true };
    } catch (error) {
      notify('error', getErrorMessage(error));
      return { ok: false };
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // The frontend still clears the expired or unreachable session.
    }

    clearToken();
    setCurrentUser(null);
    setStore((current) => ({ ...current, users: [], tasks: [], notifications: [], activityLogs: [] }));
    notify('success', 'Signed out.');
  }

  async function createTask(payload) {
    try {
      await api.post('/tasks', payload);
      await refreshData();
      notify('success', 'Task created.');
      return { ok: true };
    } catch (error) {
      notify('error', getErrorMessage(error));
      return { ok: false };
    }
  }

  async function updateTask(taskId, payload) {
    try {
      await api.put(`/tasks/${taskId}`, payload);
      await refreshData();
      notify('success', 'Task updated.');
      return { ok: true };
    } catch (error) {
      notify('error', getErrorMessage(error));
      return { ok: false };
    }
  }

  async function deleteTask(taskId) {
    try {
      await api.delete(`/tasks/${taskId}`);
      await refreshData();
      notify('success', 'Task deleted.');
    } catch (error) {
      notify('error', getErrorMessage(error));
    }
  }

  async function toggleTaskStatus(taskId) {
    const task = store.tasks.find((item) => item.task_id === taskId);
    if (!task) return;

    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: nextStatus });
      await refreshData();
      notify('success', nextStatus === 'completed' ? 'Task completed.' : 'Task returned to pending.');
    } catch (error) {
      notify('error', getErrorMessage(error));
    }
  }

  async function markNotification(notificationId, status = 'read') {
    try {
      await api.patch(`/notifications/${notificationId}`, { notification_status: status });
      await refreshData();
    } catch (error) {
      notify('error', getErrorMessage(error));
    }
  }

  async function toggleUserActive(userId) {
    const target = store.users.find((user) => user.user_id === userId);
    if (!currentUser || currentUser.role !== 'admin' || !target || target.role === 'admin') return;

    try {
      await api.patch(`/admin/users/${userId}/status`, { is_active: !target.is_active });
      await refreshData();
      notify('success', `User ${target.is_active ? 'deactivated' : 'reactivated'}.`);
    } catch (error) {
      notify('error', getErrorMessage(error));
    }
  }

  function updateSettings(nextSettings) {
    setStore((current) => ({
      ...current,
      settings: { ...current.settings, ...nextSettings },
    }));
    notify('success', 'Settings saved.');
  }

  async function restoreDemoData() {
    notify('error', 'Use the backend seed command to restore database demo data.');
  }

  const value = {
    store,
    currentUser,
    loading,
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
    refreshData,
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
