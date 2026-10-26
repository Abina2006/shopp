import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X, LogIn, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';

export default function AuthPromptModal({ isOpen, onClose, title, message }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-[20px] shadow-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 text-center transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B7280] hover:text-[#111111] hover:bg-[#F3F4F6] rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-[#EAF7EE] text-[#3FA66B] border border-[#3FA66B]/20 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EAF7EE] rounded-full text-xs font-semibold text-[#277A4D]">
            <Sparkles className="w-3.5 h-3.5" />
            Account Required
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            {title || 'Sign In or Create an Account'}
          </h3>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {message || 'Please sign in or create an account to search products, compare prices across Amazon, Flipkart, Blinkit & Zepto, and view verified deals.'}
          </p>
        </div>

        {/* Benefits reminder */}
        <div className="bg-[#FAFAF7] rounded-[14px] p-3.5 text-left space-y-2 border border-[#E5E7EB]/80 text-xs text-[#374151]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3FA66B] shrink-0" />
            <span>Search 250+ electronics & grocery products</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3FA66B] shrink-0" />
            <span>Real-time price comparisons & unit-value savings</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3FA66B] shrink-0" />
            <span>AI Price Drop Alerts & Smart Basket Optimizer</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#2A2A2A] text-white py-3 px-4 rounded-[12px] font-semibold text-sm transition-all shadow-sm"
          >
            <LogIn className="w-4 h-4 text-[#3FA66B]" />
            Sign In to Your Account
          </button>

          <button
            onClick={() => {
              onClose();
              navigate('/register');
            }}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#FAFAF7] text-[#111111] border border-[#E5E7EB] hover:border-[#111111] py-3 px-4 rounded-[12px] font-semibold text-sm transition-all"
          >
            <UserPlus className="w-4 h-4 text-[#6B7280]" />
            Create a Free Account
          </button>
        </div>

        <p className="text-[11px] text-[#9CA3AF]">
          Free forever • Instant access in under 30 seconds
        </p>
      </div>
    </div>
  );
}
