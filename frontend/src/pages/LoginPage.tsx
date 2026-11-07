import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Alert, Button, Input } from '../components/common/UI';
import { useAuth } from '../contexts/AuthContext';
import { getApiError } from '../services/api';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await login(email.trim(), password); navigate('/dashboard', { replace: true }); }
    catch (err) { setError(getApiError(err, 'Unable to sign in.')); }
    finally { setBusy(false); }
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to continue to your academic workspace.">
    {location.state?.registered && <div className="mb-5"><Alert type="success">Account created. You can sign in now.</Alert></div>}
    <form onSubmit={submit} className="space-y-5">
      {error && <Alert>{error}</Alert>}
      <label className="field-label">Email address<div className="relative mt-2"><Mail className="input-icon" /><Input className="pl-10" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" /></div></label>
      <label className="field-label">Password<div className="relative mt-2"><LockKeyhole className="input-icon" /><Input className="px-10" type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
      <Button disabled={busy} className="w-full">{busy && <LoaderCircle className="h-4 w-4 animate-spin" />}{busy ? 'Signing in…' : 'Sign in'}</Button>
    </form>
    <p className="mt-7 text-center text-sm text-slate-500">New to Academix? <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/register">Create a student account</Link></p>
  </AuthShell>;
}
