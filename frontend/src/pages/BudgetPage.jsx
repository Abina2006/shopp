import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Save, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BudgetPage() {
  const { user, isAuthenticated } = useAuth();
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [groceryLimit, setGroceryLimit] = useState('');
  const [cartTotal, setCartTotal] = useState(0);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBudget();
      fetchCartTotal();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchBudget = async () => {
    try {
      const res = await api.get('/budget', { params: { userId: user?.id } });
      const data = res.data?.data;
      if (data) {
        setMonthlyLimit(parseFloat(data.monthlyLimit) || '');
        setGroceryLimit(parseFloat(data.groceryLimit) || '');
      }
    } catch {} finally { setLoading(false); }
  };

  const fetchCartTotal = async () => {
    try {
      const res = await api.get('/cart', { params: { userId: user?.id } });
      setCartTotal(res.data?.total || 0);
    } catch {}
  };

  const handleSave = async () => {
    try {
      await api.post('/budget', {
        userId: user?.id,
        monthlyLimit: parseFloat(monthlyLimit) || 0,
        groceryLimit: parseFloat(groceryLimit) || 0,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Budget save error:', err);
    }
  };

  const handleClear = async () => {
    try {
      await api.delete('/budget', { data: { userId: user?.id } });
      setMonthlyLimit('');
      setGroceryLimit('');
    } catch (err) {
      console.error('Budget clear error:', err);
    }
  };

  const ml = parseFloat(monthlyLimit) || 0;
  const remaining = ml > 0 ? ml - cartTotal : null;
  const isOverBudget = ml > 0 && cartTotal > ml;
  const progress = ml > 0 ? Math.min((cartTotal / ml) * 100, 100) : 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 space-y-3 bg-white">
        <Wallet className="w-12 h-12 text-[#9CA3AF]" />
        <h2 className="text-lg font-bold text-[#111111]">Sign in to manage your budget</h2>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111111] flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#3FA66B]" /> Budget Guard
        </h1>
        <p className="text-xs text-[#6B7280]">Set spending thresholds to get instant warnings before overspending</p>
      </div>

      {/* Progress Card */}
      {ml > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-[#111111]">Monthly Spending Tracker</span>
            <span className="font-extrabold text-[#111111]">₹{ml.toLocaleString('en-IN')} Limit</span>
          </div>

          {/* Bar */}
          <div className="w-full h-2.5 bg-[#F7F7F5] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOverBudget ? 'bg-[#E8798F]' : progress > 80 ? 'bg-amber-400' : 'bg-[#3FA66B]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#6B7280]">Cart Total: ₹{cartTotal.toLocaleString('en-IN')}</span>
            <span className={`font-bold ${isOverBudget ? 'text-[#E8798F]' : 'text-[#3FA66B]'}`}>
              {isOverBudget ? `Over budget by ₹${Math.abs(remaining).toLocaleString('en-IN')}` : `₹${remaining?.toLocaleString('en-IN')} remaining`}
            </span>
          </div>
        </div>
      )}

      {/* Budget Settings Form */}
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h3 className="text-sm font-bold text-[#111111]">Configure Budget Limits</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
              Overall Monthly Limit (₹)
            </label>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="e.g. 15000"
              className="input-clean"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
              Monthly Grocery / Quick-Commerce Limit (₹)
            </label>
            <input
              type="number"
              value={groceryLimit}
              onChange={(e) => setGroceryLimit(e.target.value)}
              placeholder="e.g. 5000"
              className="input-clean"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button onClick={handleSave} className="btn-primary py-2 px-5 text-xs">
            {saved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3FA66B]" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Budget Limits
              </>
            )}
          </button>

          {(monthlyLimit || groceryLimit) && (
            <button onClick={handleClear} className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Clear Limits
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
