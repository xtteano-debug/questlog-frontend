import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast, setToast } = useApp();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed right-4 top-4 z-50 w-[min(92vw,360px)] rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        {isError ? <XCircle className="h-5 w-5 text-ember" /> : <CheckCircle2 className="h-5 w-5 text-mint" />}
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{toast.message}</p>
      </div>
    </div>
  );
}
