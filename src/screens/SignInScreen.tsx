import { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SignInScreenProps {
  onSuccess: () => void;
}

export function SignInScreen({ onSuccess }: SignInScreenProps) {
  const { signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-clay-100 blur-3xl opacity-60" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-sage-100 blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="card overflow-hidden">
          {/* Hero strip */}
          <div className="relative h-32 overflow-hidden">
            <img
              src="https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&h=400&w=800"
              alt="Interior"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sand-900/70 to-transparent" />
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-50/95">
                <Sparkles className="h-4 w-4 text-sand-900" strokeWidth={2.2} />
              </span>
              <span className="font-serif text-lg font-600 text-white">
                Room Revive
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="font-serif text-2xl font-600 text-sand-900">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1 text-sm text-sand-500">
              {mode === 'signin'
                ? 'Sign in to reimagine your living room.'
                : 'Start transforming your space in minutes.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-sand-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-sand-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                    className="input-field pl-10"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-sand-50 border-t-transparent" />
                    Please wait…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-sand-500">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError('');
                }}
                className="font-semibold text-sand-900 underline-offset-2 hover:underline"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-sand-400">
          Demo mode — enter any email and password to continue.
        </p>
      </div>
    </div>
  );
}
