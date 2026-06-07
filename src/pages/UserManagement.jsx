import { Search, UserCheck, UserX } from 'lucide-react';
import { useMemo, useState } from 'react';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';

export default function UserManagement() {
  const { store, toggleUserActive } = useApp();
  const [query, setQuery] = useState('');

  const users = useMemo(
    () =>
      store.users
        .filter((user) => user.role === 'user')
        .filter((user) => `${user.username} ${user.email}`.toLowerCase().includes(query.toLowerCase())),
    [store.users, query],
  );

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">User Management</p>
          <h1>Search and account status</h1>
        </div>
      </div>

      <section className="panel">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="field-input pl-10" placeholder="Search users" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>

        <div className="mt-6 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td><Badge label={user.is_active ? 'completed' : 'pending'} /></td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className={user.is_active ? 'danger-button' : 'secondary-button'} onClick={() => toggleUserActive(user.user_id)}>
                      {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      {user.is_active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
