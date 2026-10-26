import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF7]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-[#EAF7EE] border border-[#3FA66B]/30 rounded-[10px] flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-5 h-5 text-[#3FA66B]" />
          </div>
          <h1 className="text-xl font-bold text-[#111111]">Welcome back</h1>
          <p className="text-xs text-[#6B7280]">Sign in to access your budget cart, alerts, and saved deals</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1 block">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-clean pl-9 pr-4 py-2 text-xs w-full bg-[#FAFAF7]"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-clean pl-9 pr-4 py-2 text-xs w-full bg-[#FAFAF7]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-xs rounded-[10px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In'}
          </button>

          <p className="text-center text-xs text-[#6B7280] pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#3FA66B] hover:underline font-semibold">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
