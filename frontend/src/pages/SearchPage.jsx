import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Package, Sparkles, Smartphone, Laptop, AlertCircle, CheckCircle2, Lock, LogIn, UserPlus, Zap } from 'lucide-react';
import api from '../services/api';
import { cachedGet } from '../services/cache';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

// Realistic Product Card Skeleton
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden">
      {/* Image area */}
      <div className="aspect-square bg-[#F7F7F5] skeleton-light relative">
        <div className="absolute top-3 left-3 w-14 h-5 bg-[#ECECE9] rounded-[6px] skeleton-light" />
        <div className="absolute top-3 right-3 w-14 h-5 bg-[#ECECE9] rounded-[6px] skeleton-light" />
      </div>
      {/* Content area */}
      <div className="p-4 space-y-3 flex-1">
        <div className="flex justify-between">
          <div className="w-16 h-3 bg-[#F7F7F5] rounded skeleton-light" />
          <div className="w-12 h-3 bg-[#F7F7F5] rounded skeleton-light" />
        </div>
        <div className="space-y-1.5">
          <div className="w-full h-4 bg-[#F7F7F5] rounded skeleton-light" />
          <div className="w-3/4 h-4 bg-[#F7F7F5] rounded skeleton-light" />
        </div>
        <div className="pt-2 border-t border-[#F3F4F6] flex justify-between items-center">
          <div className="w-10 h-5 bg-[#F7F7F5] rounded skeleton-light" />
          <div className="w-14 h-4 bg-[#F7F7F5] rounded skeleton-light" />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="w-20 h-6 bg-[#F7F7F5] rounded skeleton-light mb-1" />
            <div className="w-24 h-3 bg-[#F7F7F5] rounded skeleton-light" />
          </div>
          <div className="w-20 h-8 bg-[#F7F7F5] rounded-[8px] skeleton-light" />
        </div>
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const requestedQty = searchParams.get('qty') || '';

  const [products, setProducts] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');

  // Clarification state
  const [eggQtyInput, setEggQtyInput] = useState('5');
  const [laptopSpecs, setLaptopSpecs] = useState({
    cpu: '',
    ram: '',
    storage: '',
    gpu: '',
    brand: '',
    budget: '',
    usage: 'Gaming'
  });
  const [mobileSpecs, setMobileSpecs] = useState({
    brand: '',
    budget: '',
    ram: '',
    storage: '',
    usage: 'Normal'
  });

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else if (!query) {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [query, categoryParam, requestedQty, searchParams.toString(), isAuthenticated]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const activeQuery = query || 'all';
      const params = { q: activeQuery };
      if (requestedQty) params.qty = requestedQty;
      if (searchParams.get('skip') === 'true') params.skip = 'true';
      if (searchParams.get('ram')) params.ram = searchParams.get('ram');
      if (searchParams.get('storage')) params.storage = searchParams.get('storage');
      if (searchParams.get('gpu')) params.gpu = searchParams.get('gpu');
      if (searchParams.get('cpu')) params.cpu = searchParams.get('cpu');
      if (searchParams.get('brand')) params.brand = searchParams.get('brand');
      if (searchParams.get('budget')) params.budget = searchParams.get('budget');

      // Use cache: same search returns instantly without API call (TTL: 2 min)
      const res = await cachedGet(api, '/products/smart-search', { params }, 2 * 60 * 1000);
      const smartData = res.data?.data;
      setSearchMeta(smartData);
      setProducts(smartData?.products || []);
    } catch (err) {
      console.error('Search error:', err);
      setProducts([]);
      setSearchMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEggClarifySubmit = (e) => {
    e.preventDefault();
    if (!eggQtyInput) return;
    setSearchParams({ q: query, qty: eggQtyInput, skip: 'true' });
  };

  const handleLaptopSpecSubmit = (e) => {
    e.preventDefault();
    const params = { q: query, skip: 'true' };
    if (laptopSpecs.ram) params.ram = laptopSpecs.ram;
    if (laptopSpecs.storage) params.storage = laptopSpecs.storage;
    if (laptopSpecs.gpu) params.gpu = laptopSpecs.gpu;
    if (laptopSpecs.cpu) params.cpu = laptopSpecs.cpu;
    if (laptopSpecs.brand) params.brand = laptopSpecs.brand;
    if (laptopSpecs.budget) params.budget = laptopSpecs.budget;
    setSearchParams(params);
  };

  const handleMobileSpecSubmit = (e) => {
    e.preventDefault();
    const params = { q: query, skip: 'true' };
    if (mobileSpecs.ram) params.ram = mobileSpecs.ram;
    if (mobileSpecs.storage) params.storage = mobileSpecs.storage;
    if (mobileSpecs.brand) params.brand = mobileSpecs.brand;
    if (mobileSpecs.budget) params.budget = mobileSpecs.budget;
    setSearchParams(params);
  };

  const handleSkipClarification = () => {
    setSearchParams({ q: query, skip: 'true' });
  };

  const FIXED_CATEGORIES = [
    { label: 'All', cat: 'All', subcat: null },
    { label: 'Snacks & Beverages', cat: 'Snacks & Beverages', subcat: null },
    { label: 'Grocery', cat: 'Grocery', subcat: null },
    { label: 'Mobile', cat: 'Electronics', subcat: 'Mobiles' },
    { label: 'Laptop', cat: 'Electronics', subcat: 'Laptops' },
    { label: 'Departmental', cat: 'Departmental', subcat: null },
    { label: 'Fashion', cat: 'Fashion', subcat: null },
  ];

  const sortedProducts = [...products]
    .filter(p => {
      if (selectedCategory === 'All') return true;
      const catLower = (p.category || '').toLowerCase();
      const subcatLower = (p.subcategory || '').toLowerCase();

      if (selectedCategory === 'Mobile') {
        return subcatLower === 'mobiles' || subcatLower === 'mobile' || ['smartphones', 'mobile', 'mobiles'].includes(catLower);
      }
      if (selectedCategory === 'Laptop') {
        return subcatLower === 'laptops' || subcatLower === 'laptop' || ['computers', 'laptops', 'laptop'].includes(catLower);
      }
      if (selectedCategory === 'Grocery') {
        return ['grocery', 'groceries', 'dairy', 'staples', 'cooking essentials'].includes(catLower);
      }
      if (selectedCategory === 'Snacks & Beverages') {
        return ['snacks & beverages', 'snacks', 'beverages'].includes(catLower);
      }
      if (selectedCategory === 'Departmental') {
        return ['departmental', 'general', 'personal care'].includes(catLower);
      }
      if (selectedCategory === 'Fashion') {
        return ['fashion', 'clothing', 'footwear'].includes(catLower);
      }
      return catLower === selectedCategory.toLowerCase() || subcatLower === selectedCategory.toLowerCase();
    })
    .sort((a, b) => {
      const getMinPrice = (p) => {
        const prices = (p.listings || []).map(l => parseFloat(l.price) || Infinity);
        return prices.length > 0 ? Math.min(...prices) : Infinity;
      };
      const getRating = (p) => {
        const ratings = (p.listings || []).map(l => l.rating).filter(Boolean);
        return ratings.length > 0 ? ratings.reduce((acc, b) => acc + b, 0) / ratings.length : 0;
      };

      if (sortBy === 'price_low') return getMinPrice(a) - getMinPrice(b);
      if (sortBy === 'price_high') return getMinPrice(b) - getMinPrice(a);
      if (sortBy === 'rating') return getRating(b) - getRating(a);
      return 0;
    });

  const categories = ['All', 'Snacks & Beverages', 'Grocery', 'Mobile', 'Laptop', 'Departmental', 'Fashion'];

  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const q = form.get('q')?.trim();
    if (q) {
      setSearchParams({ q });
    }
  };

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
            <h2 className="text-2xl font-bold text-[#111111]">Sign In to View Prices</h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Product search, price comparisons across 8 platforms, and verified deals are available to registered users.
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
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              key={query || selectedCategory}
              name="q"
              type="text"
              defaultValue={query === 'all' ? '' : query}
              placeholder="Search products, brands (e.g. Lenovo, iPhone, Samsung)..."
              className="input-clean pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
          <button type="submit" className="btn-primary px-6 text-sm">
            Search
          </button>
        </form>

        {/* Filter and Sorting */}
        <div className="pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[#6B7280] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const newParams = {};
                  if (cat !== 'All') newParams.category = cat;
                  if (query && query !== 'all') newParams.q = query;
                  setSearchParams(newParams);
                }}
                className={`px-3 py-1 rounded-[6px] transition-colors font-medium ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#F7F7F5] text-[#6B7280] hover:text-[#111111] border border-[#E5E7EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[#6B7280] font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F7F7F5] border border-[#E5E7EB] text-[#111111] text-xs font-medium rounded-[8px] px-2.5 py-1 focus:outline-none focus:border-[#111111]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>



      {/* Egg Clarification UI */}
      {searchMeta?.needsClarification && searchMeta?.clarificationType === 'quantity_eggs' && (
        <div className="p-5 bg-[#EAF7EE] border border-[#3FA66B]/40 rounded-[16px] space-y-3">
          <div className="flex items-center gap-2 text-[#277A4D]">
            <Sparkles className="w-5 h-5 text-[#3FA66B]" />
            <h3 className="text-sm font-bold">How many eggs do you need?</h3>
          </div>
          <p className="text-xs text-[#6B7280]">
            Enter your exact quantity to compare unit prices per egg across store packs.
          </p>
          <form onSubmit={handleEggClarifySubmit} className="flex flex-wrap items-center gap-2 pt-1">
            <input
              type="number"
              min="1"
              value={eggQtyInput}
              onChange={(e) => setEggQtyInput(e.target.value)}
              className="input-clean max-w-[120px] text-sm py-2 px-3 bg-white"
              placeholder="e.g. 5"
              required
            />
            <span className="text-xs font-semibold text-[#111111]">pieces</span>
            <button type="submit" className="btn-primary px-5 py-2 text-xs">
              Compare Prices
            </button>
          </form>
        </div>
      )}

      {/* Mobile Clarification UI */}
      {searchMeta?.needsClarification && searchMeta?.clarificationType === 'mobile_specs' && (
        <div className="p-5 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[16px] space-y-4">
          <div className="flex items-center gap-2 text-[#111111]">
            <Smartphone className="w-5 h-5 text-[#3FA66B]" />
            <div>
              <h3 className="text-sm font-bold">Want to refine your mobile search?</h3>
              <p className="text-xs text-[#6B7280]">Specifications are optional.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">Brand</label>
              <input
                placeholder="e.g. Apple / Samsung"
                value={mobileSpecs.brand}
                onChange={(e) => setMobileSpecs({ ...mobileSpecs, brand: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">Max Budget (₹)</label>
              <input
                type="number"
                placeholder="e.g. 25000"
                value={mobileSpecs.budget}
                onChange={(e) => setMobileSpecs({ ...mobileSpecs, budget: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">RAM</label>
              <input
                placeholder="e.g. 8GB"
                value={mobileSpecs.ram}
                onChange={(e) => setMobileSpecs({ ...mobileSpecs, ram: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">Storage</label>
              <input
                placeholder="e.g. 128GB"
                value={mobileSpecs.storage}
                onChange={(e) => setMobileSpecs({ ...mobileSpecs, storage: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">Usage</label>
              <select
                value={mobileSpecs.usage}
                onChange={(e) => setMobileSpecs({ ...mobileSpecs, usage: e.target.value })}
                className="input-clean text-xs py-2 px-3 bg-white"
              >
                <option value="Gaming">Gaming</option>
                <option value="Camera">Camera</option>
                <option value="Normal">Normal</option>
                <option value="Business">Business</option>
                <option value="Student">Student</option>
                <option value="Performance">Performance</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleMobileSpecSubmit} className="btn-primary px-5 py-2 text-xs">
              Search with Specifications
            </button>
            <button
              onClick={handleSkipClarification}
              className="bg-white text-[#111111] border border-[#E5E7EB] hover:bg-[#F7F7F5] px-4 py-2 rounded-[8px] text-xs font-semibold"
            >
              Skip & Show Mobiles
            </button>
          </div>
        </div>
      )}

      {/* Laptop Clarification UI */}
      {searchMeta?.needsClarification && searchMeta?.clarificationType === 'laptop_specs' && (
        <div className="p-5 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[16px] space-y-4">
          <div className="flex items-center gap-2 text-[#111111]">
            <Laptop className="w-5 h-5 text-[#3FA66B]" />
            <div>
              <h3 className="text-sm font-bold">Find your ideal laptop</h3>
              <p className="text-xs text-[#6B7280]">Specifications are optional.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">Processor</label>
              <input
                placeholder="e.g. Ryzen 5"
                value={laptopSpecs.cpu}
                onChange={(e) => setLaptopSpecs({ ...laptopSpecs, cpu: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">RAM</label>
              <input
                placeholder="e.g. 16GB"
                value={laptopSpecs.ram}
                onChange={(e) => setLaptopSpecs({ ...laptopSpecs, ram: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">Storage</label>
              <input
                placeholder="e.g. 512GB SSD"
                value={laptopSpecs.storage}
                onChange={(e) => setLaptopSpecs({ ...laptopSpecs, storage: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">GPU</label>
              <input
                placeholder="e.g. RTX 3050"
                value={laptopSpecs.gpu}
                onChange={(e) => setLaptopSpecs({ ...laptopSpecs, gpu: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#6B7280] mb-1">Brand</label>
              <input
                placeholder="e.g. Acer"
                value={laptopSpecs.brand}
                onChange={(e) => setLaptopSpecs({ ...laptopSpecs, brand: e.target.value })}
                className="input-clean text-xs py-2 px-3"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleLaptopSpecSubmit} className="btn-primary px-5 py-2 text-xs">
              Search with Specifications
            </button>
            <button
              onClick={handleSkipClarification}
              className="bg-white text-[#111111] border border-[#E5E7EB] hover:bg-[#F7F7F5] px-4 py-2 rounded-[8px] text-xs font-semibold"
            >
              Skip & Show Laptops
            </button>
          </div>
        </div>
      )}

      {/* Results Header / Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-[#111111]">
            {query && query !== 'all' ? `Results for "${query}"` : (selectedCategory !== 'All' ? `${selectedCategory} Products` : 'All Products')}
            <span className="text-xs font-normal text-[#6B7280] ml-2">
              ({sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'} found)
            </span>
          </h1>
          {searchMeta?.detectedCategory && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3FA66B] bg-[#EAF7EE] px-2 py-0.5 rounded-[4px]">
                Detected Category: {searchMeta.detectedCategory}
              </span>
              {searchMeta?.detectedQuantity && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-[#F7F7F5] border border-[#E5E7EB] px-2 py-0.5 rounded-[4px]">
                  Quantity: {searchMeta.detectedQuantity} {searchMeta.detectedUnit || ''}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="space-y-4">
          {/* Search Progress Bar */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex items-center gap-2 text-xs text-[#3FA66B] font-semibold">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              Searching across 8 platforms...
            </div>
            <div className="flex-1 h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#3FA66B] to-[#5BCC89] rounded-full animate-progress-bar" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} requestedQuantity={searchMeta?.detectedQuantity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#F7F7F5] border border-[#E5E7EB] rounded-[16px] space-y-3 px-4">
          <Package className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#111111]">No Matching Products Found</h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
            We couldn't find a matching product. Try different keywords.
          </p>
          <p className="text-[11px] text-[#9CA3AF]">
            Try: "Kurkure", "Milk", "5 eggs", "iPhone 15", or "Acer Nitro V15"
          </p>
        </div>
      )}
    </div>
  );
}
