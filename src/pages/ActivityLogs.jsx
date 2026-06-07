import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';

export default function ActivityLogs() {
  const { store } = useApp();
  const [query, setQuery] = useState('');

  const logs = useMemo(
    () =>
      store.activityLogs.filter((log) =>
        `${log.action} ${log.details} ${store.users.find((user) => user.user_id === log.user_id)?.email ?? ''}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [store.activityLogs, store.users, query],
  );

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Activity Logs</p>
          <h1>System audit trail</h1>
        </div>
      </div>

      <section className="panel">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="field-input pl-10" placeholder="Search logs" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>

        <div className="mt-6 space-y-3">
          {logs.map((log) => {
            const user = store.users.find((item) => item.user_id === log.user_id);
            return (
              <article key={log.log_id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold">{log.action}</h2>
                    <p className="mt-1 text-sm text-slate-500">{log.details}</p>
                    <p className="mt-1 text-xs text-slate-400">{new Date(log.log_date).toLocaleString()} | {user?.email ?? 'unknown'}</p>
                  </div>
                  <Badge label={user?.role ?? 'user'} />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
