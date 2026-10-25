import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUserAction: register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/');
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
          <h1 className="text-xl font-bold text-[#111111]">Create ShopWise Account</h1>
          <p className="text-xs text-[#6B7280]">Start comparing prices, tracking budgets, and saving money</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-clean pl-9 pr-4 py-2 text-xs w-full bg-[#FAFAF7]"
                placeholder="John Doe"
              />
            </div>
          </div>

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
                minLength={6}
                className="input-clean pl-9 pr-4 py-2 text-xs w-full bg-[#FAFAF7]"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-xs rounded-[10px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Account'}
          </button>

          <p className="text-center text-xs text-[#6B7280] pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[#3FA66B] hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
