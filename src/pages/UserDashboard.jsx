import { Bell, CheckCircle2, Flame, ListTodo, Trophy } from 'lucide-react';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import StatCard from '../components/StatCard';
import { useApp } from '../context/AppContext';

function isOverdue(task) {
  return task.status !== 'completed' && task.deadline && new Date(`${task.deadline}T23:59:59`) < new Date();
}

export default function UserDashboard() {
  const { currentUser, store, toggleTaskStatus } = useApp();
  const tasks = store.tasks.filter((task) => task.user_id === currentUser.user_id);
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const pending = tasks.length - completed;
  const overdue = tasks.filter(isOverdue).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const unread = store.notifications.filter(
    (item) => item.user_id === currentUser.user_id && item.notification_status === 'unread',
  ).length;
  const topTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">User Dashboard</p>
          <h1>Welcome, {currentUser.username}</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ListTodo} label="Total Tasks" value={tasks.length} helper={`${pending} pending`} />
        <StatCard icon={CheckCircle2} label="Completed" value={completed} accent="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200" />
        <StatCard icon={Flame} label="Overdue" value={overdue} accent="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200" />
        <StatCard icon={Bell} label="Unread Notices" value={unread} accent="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="panel">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h2 className="section-title">Progress Tracking</h2>
              <p className="section-subtitle">FR-018 to FR-020</p>
            </div>
          </div>
          <div className="mt-6">
            <ProgressBar value={progress} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-2xl font-black">{progress}</p>
              <p className="text-xs text-slate-500">Score</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-2xl font-black">{completed * 25}</p>
              <p className="text-xs text-slate-500">XP</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-2xl font-black">{Math.max(1, Math.ceil((completed + 1) / 3))}</p>
              <p className="text-xs text-slate-500">Level</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="section-title">Upcoming Quests</h2>
              <p className="section-subtitle">Prioritized by deadline</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {topTasks.length ? (
              topTasks.map((task) => (
                <div key={task.task_id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">Due {task.deadline}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge label={task.priority_level} />
                      <Badge label={task.status} />
                    </div>
                  </div>
                  <button className="secondary-button mt-4" onClick={() => toggleTaskStatus(task.task_id)}>
                    {task.status === 'completed' ? 'Revert to pending' : 'Mark completed'}
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-state">No tasks yet. Create your first task from the Task Management page.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
