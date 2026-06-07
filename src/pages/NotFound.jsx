import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 dark:bg-slate-950">
      <section className="max-w-lg text-center">
        <p className="text-sm font-black uppercase tracking-widest text-azure">404</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Quest not found</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">The page you opened does not exist in QuestLog.</p>
        <Link to="/" className="primary-button mt-6 inline-flex">
          <Home className="h-4 w-4" />
          Return home
        </Link>
      </section>
    </main>
  );
}
