import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ForgotPassword() {
  const { resetPassword } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'demo@questlog.test', password: '', confirmPassword: '' });

  function submit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return;
    const result = resetPassword(form.email, form.password);
    if (result.ok) navigate('/login');
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="text-2xl font-black text-slate-950 dark:text-white">QuestLog</Link>
        <h1 className="mt-8 text-3xl font-black">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Frontend demo reset flow for account recovery.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="field-label">
            Email
            <input className="field-input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="field-label">
            New password
            <input className="field-input" type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          <label className="field-label">
            Confirm new password
            <input className="field-input" type="password" minLength={8} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required />
          </label>
          {form.confirmPassword && form.password !== form.confirmPassword ? <p className="text-sm font-medium text-ember">Passwords do not match.</p> : null}
          <button className="primary-button w-full" type="submit">
            <KeyRound className="h-4 w-4" />
            Save password
          </button>
        </form>
        <Link to="/login" className="mt-5 inline-block text-sm link">Back to login</Link>
      </section>
    </main>
  );
}
