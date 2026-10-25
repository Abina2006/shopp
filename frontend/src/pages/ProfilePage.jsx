import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ShoppingCart, Heart, Wallet, LogOut, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ cartCount: 0, wishlistCount: 0, budget: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated, user]);

  const loadStats = async () => {
    try {
      const [cartRes, budgetRes] = await Promise.all([
        api.get('/cart', { params: { userId: user?.id } }).catch(() => ({ data: { data: [] } })),
        api.get('/budget', { params: { userId: user?.id } }).catch(() => ({ data: { data: null } })),
      ]);

      const storedWishlist = localStorage.getItem(`wishlist_${user?.id || 'guest'}`);
      let wCount = 0;
      if (storedWishlist) {
        try { wCount = JSON.parse(storedWishlist).length; } catch {}
      }

      setStats({
        cartCount: cartRes.data?.data?.length || 0,
        wishlistCount: wCount,
        budget: parseFloat(budgetRes.data?.data?.monthlyLimit) || 0
      });
    } catch {}
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 space-y-3 bg-white">
        <User className="w-12 h-12 text-[#9CA3AF]" />
        <h2 className="text-lg font-bold text-[#111111]">Sign in to view your profile</h2>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* User Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#111111] rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#111111]">{user?.name}</h1>
            <p className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 bg-[#EAF7EE] text-[#3FA66B] rounded-full">
              <ShieldCheck className="w-3 h-3" /> {user?.role || 'VERIFIED USER'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn-secondary py-2 px-4 text-xs text-red-500 hover:text-red-700 hover:border-red-200"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/cart" className="bg-white border border-[#E5E7EB] hover:border-[#111111]/30 rounded-[16px] p-5 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Budget Cart</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAFAF7] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-[#111111]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#111111]">{stats.cartCount} items</p>
          <span className="text-xs font-semibold text-[#111111] flex items-center gap-1">
            Manage cart <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link to="/budget" className="bg-white border border-[#E5E7EB] hover:border-[#111111]/30 rounded-[16px] p-5 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Monthly Budget</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF7EE] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#3FA66B]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#111111]">
            {stats.budget > 0 ? `₹${stats.budget.toLocaleString('en-IN')}` : 'Not Set'}
          </p>
          <span className="text-xs font-semibold text-[#3FA66B] flex items-center gap-1">
            Configure limits <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link to="/wishlist" className="bg-white border border-[#E5E7EB] hover:border-[#111111]/30 rounded-[16px] p-5 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Saved Wishlist</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF0F3] flex items-center justify-center">
              <Heart className="w-4 h-4 text-[#E8798F] fill-[#E8798F]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#111111]">{stats.wishlistCount} saved</p>
          <span className="text-xs font-semibold text-[#E8798F] flex items-center gap-1">
            View wishlist <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}
