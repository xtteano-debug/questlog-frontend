import { RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { store, updateSettings, restoreDemoData } = useApp();
  const [form, setForm] = useState(store.settings);

  function submit(event) {
    event.preventDefault();
    updateSettings(form);
  }

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Application preferences</h1>
        </div>
      </div>

      <section className="panel max-w-3xl">
        <form onSubmit={submit} className="space-y-5">
          <label className="field-label">
            Theme
            <select className="field-input" value={form.theme} onChange={(event) => setForm({ ...form, theme: event.target.value })}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label className="toggle-row">
            <span>
              <strong>Deadline reminders</strong>
              <small>Display deadline and overdue notification behavior.</small>
            </span>
            <input type="checkbox" checked={form.deadlineReminders} onChange={(event) => setForm({ ...form, deadlineReminders: event.target.checked })} />
          </label>

          <label className="toggle-row">
            <span>
              <strong>Weekly summary</strong>
              <small>Enable summary-style progress indicators.</small>
            </span>
            <input type="checkbox" checked={form.weeklySummary} onChange={(event) => setForm({ ...form, weeklySummary: event.target.checked })} />
          </label>

          <label className="toggle-row">
            <span>
              <strong>Compact mode</strong>
              <small>Keep denser information panels for quick review.</small>
            </span>
            <input type="checkbox" checked={form.compactMode} onChange={(event) => setForm({ ...form, compactMode: event.target.checked })} />
          </label>

          <div className="flex flex-wrap gap-3">
            <button className="primary-button" type="submit">
              <Save className="h-4 w-4" />
              Save settings
            </button>
            <button className="danger-button" type="button" onClick={restoreDemoData}>
              <RotateCcw className="h-4 w-4" />
              Restore demo data
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
