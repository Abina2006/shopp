import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, ShieldCheck, TrendingDown, Smartphone, Monitor, Headphones, Cookie, ShoppingBag, Package, CheckCircle2, Lock, LogIn, UserPlus } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { name: 'Smartphones', icon: <Smartphone className="w-4 h-4 text-[#111111]" />, query: 'smartphones', bg: 'bg-[#FAFAF7]' },
  { name: 'Laptops', icon: <Monitor className="w-4 h-4 text-[#111111]" />, query: 'laptops', bg: 'bg-[#FAFAF7]' },
  { name: 'Audio & Gadgets', icon: <Headphones className="w-4 h-4 text-[#E8798F]" />, query: 'audio', bg: 'bg-[#FFF0F3]' },
  { name: 'Snacks & Munchies', icon: <Cookie className="w-4 h-4 text-[#E8798F]" />, query: 'snacks', bg: 'bg-[#FFF0F3]' },
  { name: 'Dairy & Milk', icon: <ShoppingBag className="w-4 h-4 text-[#3FA66B]" />, query: 'dairy', bg: 'bg-[#EAF7EE]' },
  { name: 'Daily Essentials', icon: <Package className="w-4 h-4 text-[#3FA66B]" />, query: 'staples', bg: 'bg-[#EAF7EE]' },
];

const PLATFORMS = [
  'Amazon', 'Flipkart', 'Meesho', 'Blinkit', 'Instamart', 'Zepto', 'BigBasket', 'JioMart'
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth, openAuthModal } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      const res = await api.get('/products?limit=8');
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!requireAuth(null, {
      title: 'Sign In to Compare Prices',
      message: 'Please sign in or create an account to search products, compare prices across 8+ platforms, and view verified deals.'
    })) {
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchTouch = () => {
    if (!isAuthenticated) {
      openAuthModal({
        title: 'Sign In to Search & Compare',
        message: 'Please sign in or create an account to search products, compare prices across Amazon, Flipkart, Blinkit & Zepto, and view verified deals.'
      });
    }
  };

  const handleCategoryClick = (e, query) => {
    e.preventDefault();
    requireAuth(() => {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }, {
      title: 'Sign In to Browse Categories',
      message: 'Please sign in or create an account to browse categories, compare prices, and explore deals.'
    });
  };

  return (
    <div className="min-h-screen bg-white space-y-12 pb-16">
      {/* Hero Section — White + Green Accent */}
      <section className="bg-white border-b border-[#E5E7EB] pt-14 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EAF7EE] rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#EAF7EE] rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF7EE] border border-[#3FA66B]/30 rounded-full text-xs font-semibold text-[#277A4D]">
            <Sparkles className="w-3.5 h-3.5 text-[#3FA66B]" />
            AI-Powered Verified Price Comparison
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] leading-tight">
            Compare smarter. <br />
            <span className="text-[#3FA66B]">Shop better.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Find the verified lowest price across India's top shopping platforms — from electronics & laptops to instant groceries and snacks.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6">
            <div className="relative flex items-center bg-[#FAFAF7] border border-[#E5E7EB] rounded-[14px] p-1.5 focus-within:border-[#3FA66B] focus-within:bg-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <Search className="w-5 h-5 text-[#6B7280] ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={handleSearchTouch}
                onClick={handleSearchTouch}
                onChange={(e) => {
                  if (!isAuthenticated) {
                    handleSearchTouch();
                    return;
                  }
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search Kurkure, Milk, iPhone, Laptop, Oil, Tea..."
                className="w-full bg-transparent border-none text-sm text-[#111111] px-3 py-2.5 focus:outline-none placeholder:text-[#6B7280]"
              />
              <button
                type="submit"
                className="btn-primary py-2.5 px-6 text-sm shrink-0 rounded-[10px]"
              >
                Compare
              </button>
            </div>
          </form>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#6B7280] font-medium mr-1">Platforms compared:</span>
            {PLATFORMS.map((name) => (
              <span
                key={name}
                className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[6px] text-xs font-semibold text-[#111111]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">Popular Categories</h2>
            <p className="text-xs text-[#6B7280]">Browse electronics and grocery categories</p>
          </div>
          <button
            onClick={(e) => handleCategoryClick(e, 'all')}
            className="text-xs font-semibold text-[#111111] hover:text-[#3FA66B] flex items-center gap-1 transition-colors"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={(e) => handleCategoryClick(e, cat.query)}
              className="flex items-center gap-2.5 p-3.5 bg-white border border-[#E5E7EB] rounded-[14px] hover:border-[#3FA66B]/40 hover:shadow-sm transition-all group text-left cursor-pointer"
            >
              <div className={`p-2 ${cat.bg} rounded-[8px] shrink-0`}>
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-[#111111] leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured / Trending Comparisons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">Trending Comparisons</h2>
            <p className="text-xs text-[#6B7280]">Verified prices across Amazon, Flipkart, Blinkit, Instamart & Zepto</p>
          </div>
          {isAuthenticated && (
            <Link to="/search?q=all" className="text-xs font-semibold text-[#111111] hover:text-[#3FA66B] flex items-center gap-1 transition-colors">
              View All Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="relative overflow-hidden bg-gradient-to-b from-[#FAFAF7] to-white border border-[#E5E7EB] rounded-[24px] p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-[#EAF7EE] text-[#3FA66B] border border-[#3FA66B]/30 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF7EE] text-[#277A4D] rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Live Prices & Deals Locked
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                Sign in or Create an Account to View Prices
              </h3>
              <p className="text-sm text-[#6B7280] max-w-lg mx-auto leading-relaxed">
                Compare verified prices across Amazon, Flipkart, Blinkit, Instamart & Zepto, track price drop alerts, and calculate your lowest grocery basket.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#2A2A2A] text-white py-3 px-8 rounded-[12px] font-semibold text-sm transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4 text-[#3FA66B]" />
                Sign In to View Prices
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAFAF7] text-[#111111] border border-[#E5E7EB] hover:border-[#111111] py-3 px-8 rounded-[12px] font-semibold text-sm transition-all"
              >
                <UserPlus className="w-4 h-4 text-[#6B7280]" />
                Create Free Account
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-72 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[16px] skeleton-light" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[16px]">
            <p className="text-sm text-[#6B7280]">No products found in catalog.</p>
          </div>
        )}
      </section>

      {/* Why ShopWise AI Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Green — Savings */}
          <div className="p-5 bg-[#EAF7EE]/60 border border-[#3FA66B]/20 rounded-[16px] space-y-2">
            <div className="w-8 h-8 bg-[#EAF7EE] text-[#3FA66B] rounded-[8px] flex items-center justify-center border border-[#3FA66B]/30">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111111]">Verified Lowest Prices</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              We check multi-platform pricing across 8 apps with normalized unit price calculations.
            </p>
          </div>

          {/* Green — AI Advisor */}
          <div className="p-5 bg-[#EAF7EE]/60 border border-[#3FA66B]/20 rounded-[16px] space-y-2">
            <div className="w-8 h-8 bg-[#EAF7EE] text-[#3FA66B] rounded-[8px] flex items-center justify-center border border-[#3FA66B]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111111]">Grounded AI Advisor</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Ask our smart assistant for advice strictly grounded in actual verified database listings.
            </p>
          </div>

          {/* White — Security */}
          <div className="p-5 bg-white border border-[#E5E7EB] rounded-[16px] space-y-2 shadow-sm">
            <div className="w-8 h-8 bg-[#FAFAF7] text-[#111111] rounded-[8px] flex items-center justify-center border border-[#E5E7EB]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111111]">Safe Direct Links</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Buy directly on official merchant storefronts in a new tab without third-party tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
