import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Smartphone, Headphones, ShoppingBag, Cpu, Coffee, Droplets, Package, Sparkles, ArrowRight, Lock, LogIn, UserPlus, Watch, Tv, Shirt, Footprints, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Clean category mappings - no hardcoded brands so all products display by default
const ELECTRONICS = [
  { name: 'Smartphones & Mobiles',  icon: <Smartphone className="w-5 h-5 text-[#111111]" />,  query: 'phone', category: 'Mobile', bg: 'bg-[#F7F7F5]' },
  { name: 'Laptops & Computers',    icon: <Monitor className="w-5 h-5 text-[#111111]" />,     query: 'laptop', category: 'Laptop', bg: 'bg-[#F7F7F5]' },
  { name: 'Headphones & Audio',     icon: <Headphones className="w-5 h-5 text-[#E8798F]" />,  query: 'headphones', bg: 'bg-[#FFF0F3]' },
  { name: 'Smartwatches',           icon: <Watch className="w-5 h-5 text-[#3FA66B]" />,       query: 'smartwatch', bg: 'bg-[#EAF7EE]' },
  { name: 'Home Appliances',        icon: <Zap className="w-5 h-5 text-[#111111]" />,         query: 'appliances', bg: 'bg-[#F7F7F5]' },
  { name: 'Accessories & General',  icon: <Cpu className="w-5 h-5 text-[#111111]" />,        query: 'power bank', bg: 'bg-[#F7F7F5]' },
];

const FASHION = [
  { name: 'Fashion & Clothing',     icon: <Shirt className="w-5 h-5 text-[#E8798F]" />,      query: 'fashion', category: 'Fashion', bg: 'bg-[#FFF0F3]' },
  { name: 'Footwear & Shoes',       icon: <Footprints className="w-5 h-5 text-[#111111]" />, query: 'shoes', bg: 'bg-[#F7F7F5]' },
  { name: 'Personal Care & Soaps',  icon: <Sparkles className="w-5 h-5 text-[#3FA66B]" />,   query: 'soap', bg: 'bg-[#EAF7EE]' },
  { name: 'Fragrances & Deodorants',icon: <Droplets className="w-5 h-5 text-[#E8798F]" />,   query: 'perfume', bg: 'bg-[#FFF0F3]' },
  { name: 'Sunglasses',             icon: <Tv className="w-5 h-5 text-[#111111]" />,         query: 'sunglasses', bg: 'bg-[#F7F7F5]' },
  { name: 'Groceries & Kitchen',    icon: <Package className="w-5 h-5 text-[#3FA66B]" />,    query: 'groceries', category: 'Grocery', bg: 'bg-[#EAF7EE]' },
];

export default function CategoriesPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-[24px] p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-[#EAF7EE] text-[#3FA66B] border border-[#3FA66B]/30 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF7EE] text-[#277A4D] rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Sign In Required
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">Sign In to Browse Categories</h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Explore categorized price comparisons across 8 platforms by signing in or creating your account.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <Link to="/login" className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4 text-[#3FA66B]" /> Sign In to Your Account
            </Link>
            <Link to="/register" className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4 text-[#6B7280]" /> Create a Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111111]">
          Explore Product Categories
        </h1>
        <p className="text-xs text-[#6B7280]">Browse categorized comparison tables across electronics and daily groceries</p>
      </div>

      {/* Electronics Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#111111] text-white rounded flex items-center justify-center">
              <Monitor className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Electronics & Gadgets</h2>
          </div>
          <span className="text-xs text-[#6B7280]">Amazon • Flipkart • Meesho</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ELECTRONICS.map((cat) => (
            <Link
              key={cat.name}
              to={cat.category ? `/search?category=${encodeURIComponent(cat.category)}` : `/search?q=${encodeURIComponent(cat.query)}`}
              className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-[14px] hover:border-[#111111] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 ${cat.bg} rounded-[8px]`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-[#111111]">{cat.name}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#111111] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Fashion, Lifestyle & Grocery Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FFF0F3] text-[#E8798F] rounded flex items-center justify-center border border-[#E8798F]/30">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Fashion, Lifestyle & Grocery</h2>
          </div>
          <span className="text-xs text-[#6B7280]">Meesho • Myntra • Amazon • Blinkit • BigBasket</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FASHION.map((cat) => (
            <Link
              key={cat.name}
              to={cat.category ? `/search?category=${encodeURIComponent(cat.category)}` : `/search?q=${encodeURIComponent(cat.query)}`}
              className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-[14px] hover:border-[#111111] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 ${cat.bg} rounded-[8px]`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-[#111111]">{cat.name}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#111111] transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
