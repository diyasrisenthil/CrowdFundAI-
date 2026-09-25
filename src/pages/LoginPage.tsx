import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { authService } from '../services/authService';
import { TrendingUp, Lock, Mail, ArrowRight, ShieldCheck, Database } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const res = await authService.login(email, password, rememberMe);
      setMessage(res.message);
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 mb-1">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Sign in to CrowdFundAI+</h2>
          <p className="text-xs text-slate-400">
            Access campaign prediction models and analytics dashboard
          </p>
        </div>

        {/* Viva Notice: Database Auth Staging */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
          <Database className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-300">MySQL Authentication Note:</strong> In Stage 1, credentials validate locally and establish an active session. In Stage 2, this will verify against the <code>users</code> table in MySQL with bcrypt hash verification.
          </div>
        </div>

        {message && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-xs text-emerald-300">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@crowdfundai.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <span className="text-[11px] text-slate-500 cursor-not-allowed">Forgot password?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-emerald-400 hover:underline font-medium cursor-pointer"
          >
            Register new account
          </button>
        </div>
      </div>
    </div>
  );
};
