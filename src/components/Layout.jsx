import {
  Activity,
  Bell,
  ClipboardList,
  Gauge,
  Home,
  LogOut,
  Menu,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard', icon: Shield },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/logs', label: 'Activity Logs', icon: Activity },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function SidebarLink({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

export default function Layout() {
  const { currentUser, logout, store, updateSettings } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links = currentUser?.role === 'admin' ? adminLinks : userLinks;
  const unreadCount = store.notifications.filter(
    (item) => item.user_id === currentUser?.user_id && item.notification_status === 'unread',
  ).length;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function toggleTheme() {
    updateSettings({ theme: store.settings?.theme === 'dark' ? 'light' : 'dark' });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button className="icon-button" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <NavLink to="/" className="flex items-center gap-2 font-black">
            <Home className="h-5 w-5 text-azure" />
            QuestLog
          </NavLink>
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
            {store.settings?.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-4 transition lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-black">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              Q
            </div>
            QuestLog
          </NavLink>
          <button className="icon-button lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Signed in as</p>
          <p className="mt-1 font-bold">{currentUser?.username}</p>
          <p className="text-sm text-slate-500">{currentUser?.email}</p>
        </div>

        <nav className="mt-6 space-y-2">
          {links.map((link) => (
            <SidebarLink key={link.to} {...link} onClick={() => setOpen(false)} />
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <button className="secondary-button w-full justify-start" onClick={toggleTheme}>
            {store.settings?.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {store.settings?.theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button className="danger-button w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          {unreadCount ? <p className="text-xs text-slate-500">{unreadCount} unread notification(s)</p> : null}
        </div>
      </aside>

      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
