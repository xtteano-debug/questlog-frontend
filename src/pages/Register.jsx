import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  async function submit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return;
    const result = await register(form);
    if (result.ok) navigate('/login');
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="text-2xl font-black text-slate-950 dark:text-white">QuestLog</Link>
        <h1 className="mt-8 text-3xl font-black">Create account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Register a user account for the task dashboard.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="field-label">
            Username
            <input className="field-input" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
          </label>
          <label className="field-label">
            Email
            <input className="field-input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="field-label">
            Password
            <input className="field-input" type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          <label className="field-label">
            Confirm password
            <input className="field-input" type="password" minLength={8} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required />
          </label>
          {form.confirmPassword && form.password !== form.confirmPassword ? <p className="text-sm font-medium text-ember">Passwords do not match.</p> : null}
          <button className="primary-button w-full" type="submit">
            <UserPlus className="h-4 w-4" />
            Register
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-500">
          Already registered? <Link to="/login" className="link">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
