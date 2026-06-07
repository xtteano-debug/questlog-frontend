import { Activity, Bell, Shield, UserCheck, UserX, Users } from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const { store } = useApp();
  const users = store.users.filter((user) => user.role === 'user');
  const active = users.filter((user) => user.is_active).length;
  const inactive = users.length - active;
  const unread = store.notifications.filter((item) => item.notification_status === 'unread').length;
  const recentLogs = store.activityLogs.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Administrator Dashboard</p>
          <h1>System activity monitor</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Registered Users" value={users.length} />
        <StatCard icon={UserCheck} label="Active Users" value={active} accent="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200" />
        <StatCard icon={UserX} label="Inactive Users" value={inactive} accent="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200" />
        <StatCard icon={Bell} label="Unread Notices" value={unread} accent="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="panel">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-azure" />
            <div>
              <h2 className="section-title">Admin Scope</h2>
              <p className="section-subtitle">FR-021 to FR-025</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>Administrator functionality is isolated from personal task management routes.</p>
            <p>Admin users can review registered users, deactivate or reactivate user accounts, view logs, and monitor notifications.</p>
          </div>
        </section>

        <section className="panel">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-mint" />
            <div>
              <h2 className="section-title">Recent Activity</h2>
              <p className="section-subtitle">Latest six log entries</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {recentLogs.map((log) => (
              <div key={log.log_id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-wrap justify-between gap-3">
                  <p className="font-bold">{log.action}</p>
                  <Badge label={store.users.find((user) => user.user_id === log.user_id)?.role ?? 'user'} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{log.details}</p>
                <p className="mt-1 text-xs text-slate-400">{new Date(log.log_date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
