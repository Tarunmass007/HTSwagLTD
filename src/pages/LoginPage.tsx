import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

const API_BASE = '';

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
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const signupPasswordRef = useRef<HTMLInputElement>(null);

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
      if (data.userExists) {
        setAuthMode('login');
        setMessage({ type: 'success', text: 'Email verified! You can now sign in with your password.' });
        resetSignupFlow();
      } else {
        setMessage({ type: 'success', text: 'Email verified. Now set your password.' });
        setSignupStep('password');
      }
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = signupPasswordRef.current?.value ?? '';
    if (!otpVerified || !pwd) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/create-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: pwd,
          otp: otp.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create account');
      // Switch to login mode with email prefilled, password blank (stay open for user to sign in)
      setAuthMode('login');
      setPassword('');
      resetSignupFlow();
      setMessage({ type: 'success', text: 'Account created! Sign in with your password below.' });
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = loginPasswordRef.current?.value ?? '';
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
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

  const inputBase = 'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all';
  const btnPrimary = 'w-full py-3.5 rounded-xl font-semibold bg-primary text-white hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <>
      {embedded ? (
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-gray-200 dark:border-gray-700 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <LoginFormContent
                authMode={authMode}
                signupStep={signupStep}
                email={email}
                password={password}
                otp={otp}
                message={message}
                loading={loading}
                loginPasswordRef={loginPasswordRef}
                signupPasswordRef={signupPasswordRef}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onOtpChange={setOtp}
                onSendOtp={handleSendOtp}
                onVerifyOtp={handleVerifyOtp}
                onCreateAccount={handleCreateAccount}
                onLogin={handleLogin}
                onSwitchAuthMode={switchAuthMode}
                onResetSignupFlow={resetSignupFlow}
                onNavigate={onNavigate}
                onClose={onClose}
                inputBase={inputBase}
                btnPrimary={btnPrimary}
              />
            </div>
          </div>,
          document.body
        )
      ) : (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-950">
          <div className="section-store w-full max-w-md">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
              <LoginFormContent
                authMode={authMode}
                signupStep={signupStep}
                email={email}
                password={password}
                otp={otp}
                message={message}
                loading={loading}
                loginPasswordRef={loginPasswordRef}
                signupPasswordRef={signupPasswordRef}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onOtpChange={setOtp}
                onSendOtp={handleSendOtp}
                onVerifyOtp={handleVerifyOtp}
                onCreateAccount={handleCreateAccount}
                onLogin={handleLogin}
                onSwitchAuthMode={switchAuthMode}
                onResetSignupFlow={resetSignupFlow}
                onNavigate={onNavigate}
                onClose={onClose}
                inputBase={inputBase}
                btnPrimary={btnPrimary}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface LoginFormContentProps {
  authMode: 'login' | 'signup';
  signupStep: SignupStep;
  email: string;
  password: string;
  otp: string;
  message: { type: 'success' | 'error'; text: string } | null;
  loading: boolean;
  loginPasswordRef: React.RefObject<HTMLInputElement | null>;
  signupPasswordRef: React.RefObject<HTMLInputElement | null>;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onOtpChange: (v: string) => void;
  onSendOtp: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onCreateAccount: (e: React.FormEvent) => void;
  onLogin: (e: React.FormEvent) => void;
  onSwitchAuthMode: () => void;
  onResetSignupFlow: () => void;
  onNavigate: (page: string) => void;
  onClose?: () => void;
  inputBase: string;
  btnPrimary: string;
}

const LoginFormContent: React.FC<LoginFormContentProps> = ({
  authMode,
  signupStep,
  email,
  password,
  otp,
  message,
  loading,
  loginPasswordRef,
  signupPasswordRef,
  onEmailChange,
  onPasswordChange,
  onOtpChange,
  onSendOtp,
  onVerifyOtp,
  onCreateAccount,
  onLogin,
  onSwitchAuthMode,
  onResetSignupFlow,
  onNavigate,
  onClose,
  inputBase,
  btnPrimary,
}) => (
  <div className="w-full max-w-md mx-auto">
    <button
      type="button"
      onClick={() => onClose ? onClose() : onNavigate('home')}
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
      <form onSubmit={onLogin} className="space-y-5">
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
              onChange={(e) => onEmailChange(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={`${inputBase} pl-11`}
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
              ref={loginPasswordRef}
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${inputBase} pl-11`}
            />
          </div>
        </div>
        {message && (
          <div
            className={`p-4 rounded-xl text-sm ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? 'Please wait...' : 'Sign in'}
          <ArrowRight size={18} className={loading ? 'hidden' : ''} />
        </button>
      </form>
    ) : (
      <form
        onSubmit={
          signupStep === 'email'
            ? onSendOtp
            : signupStep === 'otp'
              ? onVerifyOtp
              : onCreateAccount
        }
        className="space-y-5"
      >
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
              onChange={(e) => onEmailChange(e.target.value)}
              required
              disabled={signupStep !== 'email'}
              autoComplete="email"
              placeholder="you@example.com"
              className={`${inputBase} pl-11 disabled:opacity-70 disabled:cursor-not-allowed`}
            />
          </div>
        </div>

        {signupStep === 'otp' && (
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
                onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className={`${inputBase} pl-11 font-mono text-lg tracking-[0.3em] text-center`}
                autoComplete="one-time-code"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Enter the 6-digit code sent to <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
            </p>
          </div>
        )}

        {signupStep === 'password' && (
          <div className="animate-fade-in">
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Create password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                ref={signupPasswordRef}
                id="signup-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`${inputBase} pl-11`}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">At least 6 characters</p>
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-xl text-sm ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading
              ? 'Please wait...'
              : signupStep === 'email'
                ? 'Send verification code'
                : signupStep === 'otp'
                  ? 'Continue'
                  : 'Create account'}
            <ArrowRight size={18} className={loading ? 'hidden' : ''} />
          </button>
          {signupStep !== 'email' && (
            <button
              type="button"
              onClick={onResetSignupFlow}
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
      <button type="button" onClick={onSwitchAuthMode} className="font-semibold text-primary hover:underline focus:outline-none">
        {authMode === 'login' ? 'Sign up' : 'Sign in'}
      </button>
    </p>
  </div>
);
