export default function ProgressBar({ value }) {
  const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600 dark:text-slate-300">Quest progress</span>
        <span className="font-bold text-slate-900 dark:text-white">{safeValue}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-mint via-azure to-gold transition-all"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
