import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../../services/auth.js';
import { Heart, ArrowLeft, Shield } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.39 7.37 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.61 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

export default function LoginPage({ initialTab = 'signin', onBackToHome }) {
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearError = () => setError('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    const { error: err } = await signInWithEmail(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    const { error: err } = await signUpWithEmail(email, password, name);
    if (err) setError(err);
    setLoading(false);
  };

  const handleGoogle = async () => {
    clearError();
    setLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] dark:bg-slate-900 flex flex-col justify-between p-4 transition-colors">
      {onBackToHome && (
        <div className="max-w-md mx-auto w-full pt-4">
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue as Guest / Return Home</span>
          </button>
        </div>
      )}

      <div className="w-full max-w-md mx-auto my-auto py-6">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white shadow-lg shadow-emerald-500/20 mb-3">
            <Heart className="w-7 h-7 fill-white/20" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            HealthHaven Student Space
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Sign in to sync your mood logs & peer support safely across devices
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">

          {/* Tab switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 mb-6">
            <button
              id="tab-signin"
              onClick={() => { setTab('signin'); clearError(); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'signin' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-register"
              onClick={() => { setTab('register'); clearError(); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'register' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-600 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Forms */}
          {tab === 'signin' ? (
            <form id="form-signin" onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <div>
                <label htmlFor="signin-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  id="signin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs shadow-xs transition-all disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form id="form-register" onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Name or Preferred Alias
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex R."
                  className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <div>
                <label htmlFor="register-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs shadow-xs transition-all disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            id="btn-google"
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 transition-all"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6 flex items-center justify-center space-x-1">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Privacy guaranteed. Your personal mental health logs are confidential.</span>
        </p>
      </div>

      <div />
    </div>
  );
}
