export default function StatCard({ icon: Icon, label, value, helper, accent = 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200' }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        {Icon ? (
          <div className={`rounded-lg p-3 ${accent}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {helper ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
}
