import { Bell, CheckCheck } from 'lucide-react';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';

export default function Notifications() {
  const { currentUser, store, markNotification } = useApp();
  const notifications =
    currentUser.role === 'admin'
      ? store.notifications
      : store.notifications.filter((item) => item.user_id === currentUser.user_id);

  function userName(userId) {
    return store.users.find((user) => user.user_id === userId)?.username ?? 'Unknown user';
  }

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Notifications</p>
          <h1>Deadline and system alerts</h1>
        </div>
      </div>

      <section className="panel">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-azure" />
          <div>
            <h2 className="section-title">Notification Center</h2>
            <p className="section-subtitle">FR-015, FR-016, FR-025</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {notifications.length ? (
            notifications.map((item) => (
              <article key={item.notification_id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.message}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(item.notification_date).toLocaleString()} {currentUser.role === 'admin' ? `| ${userName(item.user_id)}` : ''}
                    </p>
                  </div>
                  <Badge label={item.notification_status} />
                </div>
                {item.notification_status === 'unread' ? (
                  <button className="secondary-button mt-4" onClick={() => markNotification(item.notification_id, 'read')}>
                    <CheckCheck className="h-4 w-4" />
                    Mark read
                  </button>
                ) : null}
              </article>
            ))
          ) : (
            <p className="empty-state">No notifications yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
