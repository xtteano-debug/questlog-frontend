import { Mail, ShieldCheck, User } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { currentUser, store } = useApp();
  const tasks = store.tasks.filter((task) => task.user_id === currentUser.user_id);
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>Account overview</h1>
        </div>
      </div>

      <section className="panel">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg bg-slate-950 text-4xl font-black text-white dark:bg-white dark:text-slate-950">
            {currentUser.username.slice(0, 1)}
          </div>
          <div>
            <h2 className="text-3xl font-black">{currentUser.username}</h2>
            <p className="mt-1 flex items-center gap-2 text-slate-500"><Mail className="h-4 w-4" />{currentUser.email}</p>
            <p className="mt-1 flex items-center gap-2 text-slate-500"><ShieldCheck className="h-4 w-4" />{currentUser.role}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={User} label="Role" value={currentUser.role} />
        <StatCard label="Tasks" value={tasks.length} />
        <StatCard label="Completed" value={completed} />
      </div>

      <section className="panel">
        <h2 className="section-title">Player Progress</h2>
        <div className="mt-5">
          <ProgressBar value={progress} />
        </div>
      </section>
    </div>
  );
}
