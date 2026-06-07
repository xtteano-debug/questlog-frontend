import { CalendarClock, Check, Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import Badge from '../components/Badge';
import { priorities } from '../data/seedData';
import { useApp } from '../context/AppContext';

const blankTask = {
  title: '',
  description: '',
  priority_level: 'medium',
  deadline: new Date().toISOString().slice(0, 10),
};

function isOverdue(task) {
  return task.status !== 'completed' && task.deadline && new Date(`${task.deadline}T23:59:59`) < new Date();
}

export default function Tasks() {
  const { currentUser, store, createTask, updateTask, deleteTask, toggleTaskStatus } = useApp();
  const [form, setForm] = useState(blankTask);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const tasks = useMemo(() => {
    return store.tasks
      .filter((task) => task.user_id === currentUser.user_id)
      .filter((task) => (filter === 'all' ? true : task.status === filter))
      .filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [store.tasks, currentUser.user_id, filter, query]);

  async function submit(event) {
    event.preventDefault();
    let result;
    if (editingId) {
      result = await updateTask(editingId, form);
    } else {
      result = await createTask(form);
    }
    if (result?.ok) {
      setForm(blankTask);
      setEditingId(null);
    }
  }

  function edit(task) {
    setEditingId(task.task_id);
    setForm({
      title: task.title,
      description: task.description,
      priority_level: task.priority_level,
      deadline: task.deadline,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(blankTask);
  }

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Task Management</p>
          <h1>Create, view, update, delete</h1>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <section className="panel">
          <h2 className="section-title">{editingId ? 'Update Task' : 'Create Task'}</h2>
          <p className="section-subtitle">FR-005, FR-007, FR-011 to FR-014</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="field-label">
              Title
              <input className="field-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required maxLength={80} />
            </label>
            <label className="field-label">
              Description
              <textarea className="field-input min-h-28" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required maxLength={240} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field-label">
                Priority
                <select className="field-input" value={form.priority_level} onChange={(event) => setForm({ ...form, priority_level: event.target.value })}>
                  {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                </select>
              </label>
              <label className="field-label">
                Deadline
                <input className="field-input" type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} required />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="primary-button" type="submit">
                <Plus className="h-4 w-4" />
                {editingId ? 'Save changes' : 'Add task'}
              </button>
              {editingId ? (
                <button className="secondary-button" type="button" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="section-title">Task List</h2>
              <p className="section-subtitle">FR-006, FR-008, FR-009, FR-010, FR-017</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'completed'].map((item) => (
                <button key={item} className={filter === item ? 'tab-button-active' : 'tab-button'} onClick={() => setFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className="relative mt-5 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="field-input pl-10" placeholder="Search tasks" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>

          <div className="mt-5 space-y-3">
            {tasks.length ? (
              tasks.map((task) => (
                <article key={task.task_id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{task.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{task.description}</p>
                      <p className={`mt-2 inline-flex items-center gap-2 text-sm ${isOverdue(task) ? 'text-ember' : 'text-slate-500'}`}>
                        <CalendarClock className="h-4 w-4" />
                        Due {task.deadline} {isOverdue(task) ? '(overdue)' : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge label={task.priority_level} />
                      <Badge label={task.status} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="secondary-button" onClick={() => toggleTaskStatus(task.task_id)}>
                      <Check className="h-4 w-4" />
                      {task.status === 'completed' ? 'Revert' : 'Complete'}
                    </button>
                    <button className="secondary-button" onClick={() => edit(task)}>
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => deleteTask(task.task_id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-state">No matching tasks found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
