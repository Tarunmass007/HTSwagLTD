import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

const API_BASE = ''; // Same origin - works on htswag.net

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onClose?: () => void;
  embedded?: boolean;
  initialMode?: 'login' | 'signup';
}

type SignupStep = 'email' | 'otp' | 'password';

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onClose, embedded = false, initialMode = 'login' }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [signupStep, setSignupStep] = useState<SignupStep>('email');
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resetSignupFlow = () => {
    setSignupStep('email');
    setOtpVerified(false);
    setOtp('');
    setPassword('');
    setMessage(null);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setMessage(null);
    if (authMode === 'signup') resetSignupFlow();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');
      setMessage({ type: 'success', text: 'Verification code sent to your email. Check your inbox.' });
      setSignupStep('otp');
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || !email.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setOtpVerified(true);
      setMessage({ type: 'success', text: 'Email verified. Now set your password.' });
      setSignupStep('password');
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified || !password) return;
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp(
        { email: email.trim().toLowerCase(), password },
        { emailRedirectTo: `${window.location.origin}/` }
      );
      if (error) throw error;
      setMessage({
        type: 'success',
        text: data?.user && !data?.session
          ? 'Account created! Check your email to confirm, then sign in.'
          : 'Account created! You can sign in now.',
      });
      resetSignupFlow();
      if (data?.session && onClose) onClose();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage(null);
      if (onClose) onClose();
      else onNavigate('home');
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const FormContent = () => (
    <div className="w-full max-w-md mx-auto">
      <button
        type="button"
        onClick={() => embedded && onClose ? onClose() : onNavigate('home')}
        className="mb-8 inline-flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
      >
        <span className="font-display font-bold text-xl tracking-tight">
          HTS <span className="text-primary">SWAG</span>
        </span>
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles size={14} />
          Welcome back
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
          {authMode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {authMode === 'login'
            ? 'Manage orders, save favorites, and get exclusive offers.'
            : 'Join thousands of happy customers. Verify your email to get started.'}
        </p>
      </div>

      {authMode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="input-store pl-11"
              />
            </div>
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input-store pl-11"
              />
            </div>
          </div>
          {message && (
            <div
              className={`p-4 rounded-store text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-store-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : 'Sign in'}
            <ArrowRight size={18} className={loading ? 'hidden' : ''} />
          </button>
        </form>
      ) : (
        <form
          onSubmit={
            signupStep === 'email'
              ? handleSendOtp
              : signupStep === 'otp'
                ? handleVerifyOtp
                : handleCreateAccount
          }
          className="space-y-5"
        >
          {/* Step 1: Email */}
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={signupStep !== 'email'}
                autoComplete="email"
                placeholder="you@example.com"
                className="input-store pl-11 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Step 2: OTP */}
          {signupStep !== 'email' && (
            <div className="animate-fade-in">
              <label htmlFor="signup-otp" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Verification code
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="signup-otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={signupStep === 'password'}
                  placeholder="000000"
                  className="input-store pl-11 font-mono text-lg tracking-[0.3em] text-center disabled:opacity-70 disabled:cursor-not-allowed"
                  autoComplete="one-time-code"
                />
              </div>
              {signupStep === 'otp' && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enter the 6-digit code sent to <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
                </p>
              )}
            </div>
          )}

          {/* Step 3: Password */}
          {signupStep === 'password' && (
            <div className="animate-fade-in">
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Create password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="input-store pl-11"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">At least 6 characters</p>
            </div>
          )}

          {message && (
            <div
              className={`p-4 rounded-store text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-store-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Please wait...'
                : signupStep === 'email'
                  ? 'Send verification code'
                  : signupStep === 'otp'
                    ? 'Verify code'
                    : 'Create account'}
              <ArrowRight size={18} className={loading ? 'hidden' : ''} />
            </button>
            {signupStep !== 'email' && (
              <button
                type="button"
                onClick={resetSignupFlow}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Use a different email
              </button>
            )}
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" onClick={switchAuthMode} className="font-semibold text-primary hover:underline focus:outline-none">
          {authMode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );

  if (embedded) {
    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-store-xl shadow-store-xl max-w-md w-full p-8 relative border border-gray-200 dark:border-gray-700 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-store text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <FormContent />
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-950">
      <div className="section-store w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-store-xl shadow-store-xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
          <FormContent />
        </div>
      </div>
    </div>
  );
};
