import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Trash2, ExternalLink, ArrowRight, ShoppingCart, Star, 
  Sparkles, TrendingDown, Store, ShieldCheck, Check, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const QUICK_CATEGORIES = [
  { name: 'Laptops', query: 'laptop' },
  { name: 'Smartphones', query: 'phone' },
  { name: 'Snacks & Munchies', query: 'kurkure' },
  { name: 'Daily Grocery', query: 'milk' },
  { name: 'Audio & Earphones', query: 'earphones' },
];

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [enriched, setEnriched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [movingId, setMovingId] = useState(null);
  const [movedSuccessId, setMovedSuccessId] = useState(null);

  const storageKey = `wishlist_${user?.id || 'guest'}`;

  const loadWishlist = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  };

  const enrichProducts = async (items) => {
    if (!items.length) { 
      setEnriched([]);
      setLoading(false); 
      return; 
    }
    setLoading(true);
    try {
      const res = await api.get('/products');
      const data = res.data?.data || [];
      const map = {};
      data.forEach(p => { map[p.id] = p; });
      const result = items.map(w => map[w.id] || w);
      setEnriched(result);
    } catch {
      setEnriched(items);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await api.get('/products');
      const data = res.data?.data || [];
      // Pick 4 diverse trending items
      setTrendingProducts(data.slice(0, 4));
    } catch (err) {
      console.error('Trending fetch error:', err);
    }
  };

  useEffect(() => {
    loadWishlist();
    fetchTrending();
  }, [user]);

  useEffect(() => {
    enrichProducts(wishlist);
  }, [wishlist]);

  const handleRemove = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleToggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter(item => item.id !== product.id);
    } else {
      updated = [...wishlist, { 
        id: product.id, 
        name: product.name, 
        imageUrl: product.imageUrl, 
        category: product.category 
      }];
    }
    setWishlist(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleClear = () => {
    setWishlist([]);
    localStorage.removeItem(storageKey);
  };

  const handleMoveToCart = async (item) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    const listings = item.listings || [];
    const cheapest = listings.reduce((best, l) => {
      const p = parseFloat(l.price) || Infinity;
      return p < (parseFloat(best?.price) || Infinity) ? l : best;
    }, listings[0]);

    if (!cheapest) return;

    setMovingId(item.id);
    try {
      await api.post('/cart', {
        userId: user?.id,
        listingId: cheapest.id || cheapest.listingId,
        quantity: 1,
        unit: item.unit || 'unit'
      });
      setMovedSuccessId(item.id);
      setTimeout(() => {
        setMovedSuccessId(null);
        handleRemove(item.id);
      }, 1500);
    } catch (err) {
      console.error('Move to cart error:', err);
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-[#E8798F] fill-[#E8798F]" /> My Saved Wishlist
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#E8798F] border border-[#E8798F]/20">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Track your favorite products, monitor price drops, and compare lowest store prices across 8 platforms
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/ai-assistant"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0F3] border border-[#E8798F]/30 hover:bg-[#FFE5EC] text-[#E8798F] text-xs font-semibold rounded-[8px] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ask AI Advisor
          </Link>
          {wishlist.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1.5 transition-colors"
            >
              Clear Wishlist
            </button>
          )}
        </div>
      </div>

      {/* Grid of Wishlist Items OR Rich Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[16px] animate-pulse" />
          ))}
        </div>
      ) : enriched.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enriched.map((item) => {
            const listings = item.listings || [];
            const prices = listings.map(l => parseFloat(l.price) || 0).filter(p => p > 0);
            const bestPrice = prices.length > 0 ? Math.min(...prices) : item.price || null;
            const bestListing = listings.find(l => parseFloat(l.price) === bestPrice) || listings[0];
            const store = bestListing?.sellerName || bestListing?.marketplace || 'Marketplace';
            const buyUrl = bestListing?.buyUrl || bestListing?.productUrl || bestListing?.sellerUrl;
            const isMoving = movingId === item.id;
            const isMoved = movedSuccessId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border border-[#E5E7EB] hover:border-[#111111]/30 rounded-[16px] p-4 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative w-full h-40 bg-[#FAFAF7] rounded-[12px] p-3 flex items-center justify-center border border-[#F3F4F6] overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-sm border border-[#E5E7EB] flex items-center justify-center transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#6B7280] mb-1">
                      <span className="font-semibold text-[#3FA66B] bg-[#EAF7EE] px-1.5 py-0.2 rounded uppercase">
                        {item.category || 'Product'}
                      </span>
                      {listings.length > 0 && (
                        <span>{listings.length} stores compared</span>
                      )}
                    </div>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-bold text-sm text-[#111111] hover:underline line-clamp-2 block leading-snug"
                      title={item.name}
                    >
                      {item.name}
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-[#F3F4F6] flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-[#6B7280] block">Lowest Store Price</span>
                      <span className="text-lg font-extrabold text-[#111111]">
                        {bestPrice ? `₹${Number(bestPrice).toLocaleString('en-IN')}` : 'Check Price'}
                      </span>
                    </div>
                    {bestListing && (
                      <span className="text-[11px] font-medium text-[#3FA66B] bg-[#EAF7EE] px-2 py-0.5 rounded">
                        Lowest on {store}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/product/${item.id}`}
                      className="btn-secondary py-2 text-xs flex items-center justify-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    {buyUrl ? (
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold rounded-[8px] transition-colors"
                      >
                        <span>Buy on {store}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        to={`/product/${item.id}`}
                        className="btn-primary py-2 text-xs text-center"
                      >
                        Buy Now
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={isMoving}
                    className="w-full py-2 bg-[#FAFAF7] hover:bg-[#EAF7EE] text-[#111111] hover:text-[#3FA66B] border border-[#E5E7EB] hover:border-[#3FA66B] rounded-[8px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isMoved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#3FA66B]" /> Moved to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" /> Move to Budget Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Rich Empty State */
        <div className="space-y-8">
          <div className="text-center py-12 px-4 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[20px] shadow-sm space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FFF0F3] border border-[#E8798F]/20 flex items-center justify-center mx-auto shadow-sm text-[#E8798F]">
              <Heart className="w-8 h-8 fill-[#E8798F]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Your Wishlist is empty</h3>
              <p className="text-xs text-[#6B7280] max-w-md mx-auto mt-1 leading-relaxed">
                Save your favorite products to automatically track price drops across Amazon, Flipkart, Blinkit, and 5 other stores.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <Link to="/catalog" className="btn-primary py-2 px-5 text-xs inline-flex items-center gap-1.5">
                <span>Explore Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/ai-assistant" className="btn-secondary py-2 px-4 text-xs inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E8798F]" />
                <span>Ask AI Shopping Advisor</span>
              </Link>
            </div>
          </div>

          {/* Quick Category Discovery */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Explore Popular Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {QUICK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.query}
                  to={`/search?q=${cat.query}`}
                  className="px-3 py-1.5 bg-white border border-[#E5E7EB] hover:border-[#111111] hover:bg-[#FAFAF7] rounded-[8px] text-xs font-semibold text-[#111111] transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Deals You Can Save */}
          {trendingProducts.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-[#E8798F]" /> Trending Deals You May Want to Save
                  </h3>
                  <p className="text-xs text-[#6B7280]">Add products to your wishlist to get price change alerts</p>
                </div>
                <Link to="/catalog" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
                  Browse Catalog <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingProducts.map((prod) => {
                  const listings = prod.listings || [];
                  const prices = listings.map(l => parseFloat(l.price) || 0).filter(Boolean);
                  const lowest = prices.length > 0 ? Math.min(...prices) : prod.price || 0;
                  const cheapestListing = listings.find(l => parseFloat(l.price) === lowest) || listings[0] || {};
                  const store = cheapestListing.sellerName || cheapestListing.marketplace || 'Marketplace';
                  const isSaved = wishlist.some(w => w.id === prod.id);

                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-[#E5E7EB] hover:border-[#111111]/30 rounded-[14px] p-3.5 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="space-y-2.5">
                        <div className="relative w-full h-28 bg-[#FAFAF7] rounded-[10px] p-2 flex items-center justify-center border border-[#F3F4F6] overflow-hidden">
                          <img
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'}
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <button
                            onClick={() => handleToggleWishlist(prod)}
                            className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                              isSaved
                                ? 'bg-[#FFF0F3] text-[#E8798F] border-[#E8798F]'
                                : 'bg-white/90 text-[#9CA3AF] hover:text-[#E8798F] border-[#E5E7EB]'
                            }`}
                            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#E8798F]' : ''}`} />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[10px] text-[#6B7280] mb-1">
                            <span className="font-semibold text-[#3FA66B] bg-[#EAF7EE] px-1.5 py-0.2 rounded uppercase">
                              {store}
                            </span>
                            <span>{listings.length} stores</span>
                          </div>
                          <Link
                            to={`/product/${prod.id}`}
                            className="font-semibold text-xs text-[#111111] hover:underline line-clamp-2 block leading-snug"
                            title={prod.name}
                          >
                            {prod.name}
                          </Link>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-[#9CA3AF] block">Lowest Price</span>
                          <span className="font-extrabold text-sm text-[#111111]">
                            ₹{Number(lowest).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleToggleWishlist(prod)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all flex items-center gap-1 ${
                            isSaved
                              ? 'bg-[#FFF0F3] text-[#E8798F] border border-[#E8798F]/40'
                              : 'bg-[#111111] hover:bg-[#333333] text-white shadow-sm'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#E8798F]' : ''}`} />
                          <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E7EB]">
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-[14px] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFF0F3] text-[#E8798F] flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">Price Drop Alerts</h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Save products here and receive instant notifications whenever the price drops on any marketplace.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#E5E7EB] rounded-[14px] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#EAF7EE] text-[#3FA66B] flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">Unified Shopping List</h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Consolidate your wishlist across Amazon, Flipkart, Blinkit, and Zepto into a single clean dashboard.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#E5E7EB] rounded-[14px] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#FAFAF7] text-[#111111] flex items-center justify-center border border-[#E5E7EB]">
                <ShieldCheck className="w-4 h-4 text-[#3FA66B]" />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">One-Click Cart Transfer</h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Move items from your wishlist directly into your Budget Cart with automatic spending limit tracking.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
