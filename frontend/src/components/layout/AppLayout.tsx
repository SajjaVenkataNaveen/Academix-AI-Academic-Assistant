import { BookOpenText, Bot, FileText, LayoutDashboard, LogOut, Menu, ShieldCheck, Users, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['STUDENT', 'FACULTY', 'ADMIN'] },
  { to: '/chat', label: 'AI Assistant', icon: Bot, roles: ['STUDENT', 'FACULTY', 'ADMIN'] },
  { to: '/documents', label: 'Documents', icon: FileText, roles: ['STUDENT', 'FACULTY', 'ADMIN'] },
  { to: '/admin/users', label: 'User management', icon: Users, roles: ['ADMIN'] },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigation = links.filter((link) => user && link.roles.includes(user.role));

  return <div className="min-h-screen bg-slate-50">
    <button aria-label="Open navigation" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-30 rounded-xl border bg-white p-2 shadow-sm lg:hidden"><Menu /></button>
    {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-brand-900 px-4 py-6 text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-white/10 p-2"><BookOpenText className="h-6 w-6" /></div><div><p className="text-lg font-bold">Academix AI</p><p className="text-xs text-blue-200">Academic knowledge assistant</p></div></div>
        <button aria-label="Close navigation" className="lg:hidden" onClick={() => setOpen(false)}><X /></button>
      </div>
      <nav className="mt-9 flex-1 space-y-1">
        {navigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-white text-brand-900 shadow' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}><Icon className="h-5 w-5" />{label}</NavLink>)}
      </nav>
      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-teal-500 font-semibold">{user?.name.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{user?.name}</p><p className="flex items-center gap-1 text-xs text-blue-200"><ShieldCheck className="h-3 w-3" />{user?.role}</p></div></div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-blue-100 transition hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" />Sign out</button>
      </div>
    </aside>
    <main className="min-h-screen lg:ml-72"><Outlet /></main>
  </div>;
}
