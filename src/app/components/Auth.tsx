import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, Mail, Sparkles, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        await signIn(email, password);
      }
      const from = typeof location.state === 'object' && location.state && 'from' in location.state
        ? String(location.state.from)
        : '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue your workspace">
      {!isSupabaseConfigured && <Notice tone="amber">Demo mode: add Supabase keys to enable real login.</Notice>}
      {error && <Notice tone="red">{error}</Notice>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          icon={Mail}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Field
          icon={Lock}
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Login'}
          <ArrowRight size={20} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-black underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}

export function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        await signUp(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Start your personal learning workspace">
      {!isSupabaseConfigured && (
        <Notice tone="cyan" icon>
          Demo mode: signup continues without storing an account until Supabase keys are added.
        </Notice>
      )}
      {error && <Notice tone="red">{error}</Notice>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field icon={User} label="Full Name" value={name} onChange={setName} placeholder="Your name" />
        <Field
          icon={Mail}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Field
          icon={Lock}
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Minimum 6 characters"
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create Account'}
          <ArrowRight size={20} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-black underline-offset-4 hover:underline">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
        >
          <ArrowLeft size={17} />
          Back to home
        </Link>
        <div className="mb-8 text-center">
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black shadow-sm">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
          </Link>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-950">{title}</h1>
          <p className="text-sm text-zinc-600">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  icon: typeof Mail;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-zinc-700">{label}</label>
      <div className="relative">
        <Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}

function Notice({ children, tone, icon = false }: { children: React.ReactNode; tone: 'amber' | 'cyan' | 'red'; icon?: boolean }) {
  const classes = {
    amber: 'border-zinc-200 bg-zinc-50 text-zinc-700',
    cyan: 'border-zinc-200 bg-zinc-50 text-zinc-700',
    red: 'border-red-200 bg-red-50 text-red-700',
  }[tone];

  return (
    <div className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${classes}`}>
      {icon && <Sparkles size={18} className="mt-0.5 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}
