import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Alert, Button, Input } from '../components/common/UI';
import { useAuth } from '../contexts/AuthContext';
import { getApiError } from '../services/api';

export function RegisterPage() {
  const { user, register } = useAuth(); const navigate = useNavigate();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  if (user) return <Navigate to="/dashboard" replace />;
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(''); if (password.length < 6) return setError('Password must contain at least 6 characters.'); setBusy(true); try { await register(name.trim(), email.trim(), password); navigate('/login', { replace: true, state: { registered: true } }); } catch (err) { setError(getApiError(err, 'Unable to create your account.')); } finally { setBusy(false); } };
  return <AuthShell title="Create your account" subtitle="Student accounts receive secure access to approved academic materials.">
    <form onSubmit={submit} className="space-y-5">{error && <Alert>{error}</Alert>}
      <label className="field-label">Full name<div className="relative mt-2"><UserRound className="input-icon" /><Input className="pl-10" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></div></label>
      <label className="field-label">Email address<div className="relative mt-2"><Mail className="input-icon" /><Input className="pl-10" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" /></div></label>
      <label className="field-label">Password<div className="relative mt-2"><LockKeyhole className="input-icon" /><Input className="px-10" type={show ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
      <Button disabled={busy} className="w-full">{busy && <LoaderCircle className="h-4 w-4 animate-spin" />}{busy ? 'Creating account…' : 'Create account'}</Button>
    </form><p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link className="font-semibold text-brand-600" to="/login">Sign in</Link></p>
  </AuthShell>;
}
