import { ArrowRight, Bot, Clock3, FileText, MessageSquareText, Upload, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Spinner } from '../components/common/UI';
import { useAuth } from '../contexts/AuthContext';
import { chatApi, documentsApi, getApiError, usersApi } from '../services/api';
import type { Conversation, DocumentRecord, User } from '../types';

function formatDate(value: string) { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)); }

export function DashboardPage() {
  const { user } = useAuth(); const [documents, setDocuments] = useState<DocumentRecord[]>([]); const [conversations, setConversations] = useState<Conversation[]>([]); const [users, setUsers] = useState<User[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { const load = async () => { try { const [docs, chats, people] = await Promise.all([documentsApi.list(), chatApi.list(), user?.role === 'ADMIN' ? usersApi.list() : Promise.resolve([])]); setDocuments(docs); setConversations(chats); setUsers(people); } catch (err) { setError(getApiError(err, 'Could not load dashboard data.')); } finally { setLoading(false); } }; void load(); }, [user?.role]);
  if (loading) return <Spinner label="Loading your workspace" />;
  const cards = [
    { label: 'Available documents', value: documents.length, icon: FileText, color: 'bg-blue-50 text-brand-600' },
    { label: 'Your conversations', value: conversations.length, icon: MessageSquareText, color: 'bg-teal-50 text-teal-600' },
    ...(user?.role === 'ADMIN' ? [{ label: 'Registered users', value: users.length, icon: Users, color: 'bg-violet-50 text-violet-600' }] : []),
  ];
  return <div className="page-wrap">
    <header className="mb-8"><p className="eyebrow">{user?.role.toLowerCase()} workspace</p><h1 className="page-title">Welcome back, {user?.name.split(' ')[0]}</h1><p className="page-subtitle">Access trusted academic material and continue where you left off.</p></header>
    {error && <div className="mb-6"><Alert>{error}</Alert></div>}
    <section className={`grid gap-4 ${cards.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>{cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="card flex items-center gap-4"><div className={`rounded-2xl p-3 ${color}`}><Icon className="h-6 w-6" /></div><div><p className="text-3xl font-bold text-ink">{value}</p><p className="text-sm text-slate-500">{label}</p></div></div>)}</section>
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <div className="card"><div className="mb-5 flex items-center justify-between"><div><h2 className="section-title">Recent conversations</h2><p className="text-sm text-slate-500">Your latest document-based questions</p></div><Link className="text-link" to="/chat">View all <ArrowRight className="h-4 w-4" /></Link></div>
        {conversations.length ? <div className="divide-y divide-slate-100">{conversations.slice(0, 5).map((chat) => <Link key={chat.id} to={`/chat/${chat.id}`} className="group flex items-center gap-3 py-4 first:pt-0 last:pb-0"><div className="rounded-xl bg-slate-100 p-2 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600"><Bot className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate font-medium text-ink">{chat.title || 'New conversation'}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><Clock3 className="h-3 w-3" />{formatDate(chat.updatedAt)} · {chat.messages?.length ?? 0} messages</p></div><ArrowRight className="h-4 w-4 text-slate-300" /></Link>)}</div> : <div className="py-10 text-center"><MessageSquareText className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 text-sm text-slate-500">No conversations yet.</p><Link to="/chat" className="text-link mt-3 justify-center">Ask your first question <ArrowRight className="h-4 w-4" /></Link></div>}
      </div>
      <div className="card bg-brand-900 text-white"><p className="text-sm font-semibold text-blue-200">Quick action</p><h2 className="mt-3 text-2xl font-bold">{user?.role === 'STUDENT' ? 'Ask the academic assistant' : 'Keep knowledge up to date'}</h2><p className="mt-3 text-sm leading-6 text-blue-100">{user?.role === 'STUDENT' ? 'Choose an approved document and get a grounded answer with sources.' : 'Upload course materials for students, or explore them through the assistant.'}</p><div className="mt-7 flex flex-wrap gap-3"><Link className="btn bg-white text-brand-900 hover:bg-blue-50" to="/chat"><Bot className="h-4 w-4" />Open assistant</Link>{user?.role !== 'STUDENT' && <Link className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20" to="/documents"><Upload className="h-4 w-4" />Upload PDF</Link>}</div></div>
    </section>
  </div>;
}
