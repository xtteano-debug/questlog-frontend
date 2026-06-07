const priorityClasses = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200',
  pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
  admin: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200',
  user: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200',
};

export default function Badge({ label }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${priorityClasses[label] ?? priorityClasses.pending}`}>
      {label}
    </span>
  );
}
