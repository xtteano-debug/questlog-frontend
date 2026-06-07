import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'demo@questlog.test', password: 'demo1234' });

  async function submit(event) {
    event.preventDefault();
    const result = await login(form.email, form.password);
    if (result.ok) {
      navigate(result.role === 'admin' ? '/admin' : '/dashboard');
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="text-2xl font-black text-slate-950 dark:text-white">QuestLog</Link>
        <h1 className="mt-8 text-3xl font-black">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Access your task quests or administrator console.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="field-label">
            Email
            <input className="field-input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="field-label">
            Password
            <input className="field-input" type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          <button className="primary-button w-full" type="submit">
            <LogIn className="h-4 w-4" />
            Login
          </button>
        </form>

        <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
          <Link to="/forgot-password" className="link">Forgot password?</Link>
          <Link to="/register" className="link">Create account</Link>
        </div>
        <div className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p><strong>User:</strong> demo@questlog.test / demo1234</p>
          <p><strong>Admin:</strong> admin@questlog.test / admin1234</p>
        </div>
      </section>
    </main>
  );
}
