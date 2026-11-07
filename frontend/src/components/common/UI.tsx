import { LoaderCircle, XCircle, CheckCircle2 } from 'lucide-react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export function Button({ className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`btn ${className}`} {...props}>{children}</button>;
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`input ${className}`} {...props} />;
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <div className="flex items-center justify-center gap-2 py-8 text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /><span>{label}</span></div>;
}

export function Alert({ type = 'error', children }: { type?: 'error' | 'success'; children: ReactNode }) {
  const success = type === 'success';
  return <div role="alert" className={`flex gap-2 rounded-xl border p-3 text-sm ${success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
    {success ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}{children}
  </div>;
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
    <div className="mb-4 rounded-2xl bg-brand-50 p-3 text-brand-600">{icon}</div>
    <h3 className="font-semibold text-ink">{title}</h3><p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>;
}
