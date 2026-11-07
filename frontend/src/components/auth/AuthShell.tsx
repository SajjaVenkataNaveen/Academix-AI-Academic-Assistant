import { BookOpenText, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function AuthShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
    <section className="relative hidden overflow-hidden bg-brand-900 p-14 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[70px] border-white/5" />
      <div className="relative flex items-center gap-3"><div className="rounded-xl bg-white/10 p-2.5"><BookOpenText /></div><span className="text-xl font-bold">Academix AI</span></div>
      <div className="relative max-w-xl"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-teal-50">Learn from trusted sources</p><h1 className="text-5xl font-bold leading-tight">Your academic documents, made conversational.</h1><p className="mt-6 text-lg leading-8 text-blue-100">Ask questions and receive grounded answers with transparent references to your institution's materials.</p>
        <div className="mt-9 space-y-3 text-sm text-blue-50">{['Document-grounded responses', 'Conversation history', 'Clear source references'].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-teal-50" />{item}</p>)}</div>
      </div>
      <p className="relative text-xs text-blue-300">Built for focused, trustworthy academic discovery.</p>
    </section>
    <section className="flex items-center justify-center px-6 py-12"><div className="w-full max-w-md"><div className="mb-9 lg:hidden"><div className="flex items-center gap-2 text-brand-900"><BookOpenText /><span className="text-xl font-bold">Academix AI</span></div></div><h2 className="text-3xl font-bold tracking-tight text-ink">{title}</h2><p className="mt-2 text-slate-500">{subtitle}</p><div className="mt-8">{children}</div></div></section>
  </main>;
}
