import { ArrowRight, Bell, CheckCircle2, Shield, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: CheckCircle2, title: 'Task quests', text: 'Create, update, complete, and reopen tasks with clear progress states.' },
  { icon: Trophy, title: 'Gamified progress', text: 'Track completion percentage, XP-style wins, and priority difficulty.' },
  { icon: Bell, title: 'Notifications', text: 'See unread notices, overdue tasks, and deadline reminders.' },
  { icon: Shield, title: 'Admin area', text: 'Review users, account status, notifications, and activity logs.' },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.28),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm text-slate-200">
              <Sparkles className="h-4 w-4 text-gold" />
              Gamified task management
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-normal sm:text-6xl lg:text-7xl">QuestLog</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              A responsive task management web application with user and administrator workflows, progress tracking,
              priority badges, notifications, and activity monitoring.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="primary-button">
                Start demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="secondary-button border-white/20 bg-white/10 text-white hover:bg-white/15">
                Create account
              </Link>
            </div>
          
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-soft backdrop-blur">
            <div className="grid gap-4">
              <div className="rounded-lg bg-white p-5 text-slate-950">
                <div className="flex items-center justify-between">
                  <p className="font-bold">Today&apos;s Quest Board</p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">67% done</span>
                </div>
                <div className="mt-5 space-y-3">
                  {['Finalize SRS chapter', 'Design dashboard mockup', 'Prepare presentation notes'].map((task, index) => (
                    <div key={task} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                      <div>
                        <p className="font-semibold">{task}</p>
                        <p className="text-sm text-slate-500">{index === 1 ? 'Completed' : 'Pending'}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${index === 0 ? 'bg-red-100 text-red-700' : index === 1 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {index === 0 ? 'hard' : index === 1 ? 'done' : 'medium'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Tasks', 'Alerts', 'Logs'].map((item, index) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-slate-900 p-4">
                    <p className="text-2xl font-black">{[12, 4, 28][index]}</p>
                    <p className="text-sm text-slate-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white py-12 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-slate-200 p-5">
              <feature.icon className="h-6 w-6 text-azure" />
              <h2 className="mt-4 text-lg font-bold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
