import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Trash2, Wallet, ExternalLink, ShieldAlert, Plus, Minus, 
  Sparkles, Check, ArrowRight, TrendingUp, ShieldCheck, Store, RefreshCw
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(0);
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [addedSuccessId, setAddedSuccessId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchBudget();
    } else {
      setLoading(false);
    }
    fetchRecommendations();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data?.data || []);
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudget = async () => {
    try {
      const res = await api.get('/budget');
      const limit = parseFloat(res.data?.data?.monthlyLimit) || 0;
      setBudget(limit);
      setTempBudget(limit ? limit.toString() : '5000');
    } catch {
      setTempBudget('5000');
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/products?limit=4');
      const items = res.data?.data || [];
      setRecommendedProducts(items.slice(0, 4));
    } catch (err) {
      console.error('Recommendations error:', err);
    }
  };

  const handleUpdateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      removeItem(itemId);
      return;
    }
    try {
      await api.patch(`/cart/${itemId}`, { quantity: newQty });
      setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
    } catch (err) {
      console.error('Update quantity error:', err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      setCartItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const clearAll = async () => {
    try {
      await api.delete('/cart/clear');
      setCartItems([]);
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const saveBudget = async (customVal) => {
    const val = parseFloat(customVal || tempBudget);
    if (isNaN(val) || val < 0) return;
    try {
      await api.post('/budget', {
        userId: user?.id,
        monthlyLimit: val,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setBudget(val);
      setEditingBudget(false);
    } catch (err) {
      console.error('Save budget error:', err);
    }
  };

  const handleQuickAdd = async (product) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    const listings = product.listings || [];
    const cheapest = listings.reduce((best, l) => {
      const p = parseFloat(l.price) || Infinity;
      return p < (parseFloat(best?.price) || Infinity) ? l : best;
    }, listings[0]);

    if (!cheapest) return;

    setAddingId(product.id);
    try {
      await api.post('/cart', {
        listingId: cheapest.id || cheapest.listingId,
        quantity: 1,
        unit: product.baseUnit || null
      });
      setAddedSuccessId(product.id);
      fetchCart();
      setTimeout(() => setAddedSuccessId(null), 2500);
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setAddingId(null);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.listing?.price || 0);
    return sum + price * (item.quantity || 1);
  }, 0);

  const remaining = budget > 0 ? budget - total : null;
  const isOverBudget = budget > 0 && total > budget;
  const budgetProgress = budget > 0 ? Math.min(100, (total / budget) * 100) : 0;

  function handleBuy(listing) {
    const url = listing?.buyUrl || listing?.productUrl || listing?.sellerUrl;
    if (!url || url === '#' || url === '') return;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Unable to open shopping source:', error);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 space-y-4 bg-white max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF0F3] border border-[#E8798F]/20 flex items-center justify-center text-[#E8798F]">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#111111]">Sign in to view your Budget Cart</h2>
        <p className="text-xs text-[#6B7280]">
          Track real-time spend across Amazon, Flipkart, Blinkit, and BigBasket while keeping under your monthly budget limit.
        </p>
        <Link to="/login" className="btn-primary py-2.5 px-6 text-sm">
          Sign In to ShopWise
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-[#111111]" /> Budget Cart
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#374151]">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Real-time spending tally with automated multi-store price tracking & budget limits
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/ai-assistant"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0F3] border border-[#E8798F]/30 hover:bg-[#FFE5EC] text-[#E8798F] text-xs font-semibold rounded-[8px] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ask AI Advisor
          </Link>
          {cartItems.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1.5 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {/* Budget Limit Tracker */}
      <div className={`p-5 bg-white border rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5 ${
        isOverBudget ? 'border-[#E8798F] bg-[#FFF0F3]/30' : 'border-[#E5E7EB]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF7EE] text-[#3FA66B] flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#6B7280] block font-medium">Monthly Spending Limit</span>
              {editingBudget ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold">₹</span>
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="w-28 px-2 py-1 border border-[#E5E7EB] rounded text-xs font-bold"
                    placeholder="e.g. 5000"
                  />
                  <button
                    onClick={() => saveBudget()}
                    className="px-2.5 py-1 bg-[#111111] text-white rounded text-[11px] font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBudget(false)}
                    className="text-[#6B7280] hover:text-[#111111] text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#111111]">
                    {budget > 0 ? `₹${budget.toLocaleString('en-IN')}` : 'No limit set'}
                  </span>
                  <button
                    onClick={() => setEditingBudget(true)}
                    className="text-[11px] text-[#3FA66B] hover:underline font-semibold"
                  >
                    {budget > 0 ? 'Edit' : 'Set Limit'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#6B7280] block">Cart Total / Status</span>
            <span className={`text-sm font-extrabold ${isOverBudget ? 'text-[#E8798F]' : 'text-[#3FA66B]'}`}>
              {isOverBudget ? (
                <span className="flex items-center gap-1 justify-end">
                  <ShieldAlert className="w-4 h-4" /> Over budget by ₹{Math.abs(remaining).toLocaleString('en-IN')}
                </span>
              ) : budget > 0 ? (
                `₹${remaining?.toLocaleString('en-IN')} remaining`
              ) : (
                `₹${total.toLocaleString('en-IN')} in cart`
              )}
            </span>
          </div>
        </div>

        {budget > 0 && (
          <div className="space-y-1">
            <div className="w-full h-2.5 bg-[#F7F7F5] rounded-full overflow-hidden border border-[#E5E7EB]/50">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverBudget ? 'bg-[#E8798F]' : budgetProgress > 80 ? 'bg-amber-400' : 'bg-[#3FA66B]'
                }`}
                style={{ width: `${budgetProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#9CA3AF] font-medium">
              <span>₹0</span>
              <span>{Math.round(budgetProgress)}% utilized</span>
              <span>₹{budget.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Cart Content: Items List OR Rich Empty State */}
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items Column */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => {
              const listing = item.listing || {};
              const product = listing.product || {};
              const price = parseFloat(listing.price || 0);
              const store = listing.sellerName || listing.marketplace || 'Marketplace';
              const buyUrl = listing.buyUrl || listing.productUrl || listing.sellerUrl;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-[#E5E7EB] hover:border-[#111111]/30 rounded-[14px] shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-16 h-16 bg-[#F7F7F5] border border-[#E5E7EB] rounded-[10px] p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=120'}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#EAF7EE] text-[#3FA66B] font-bold px-1.5 py-0.5 rounded uppercase">
                          {store}
                        </span>
                        {product.category && (
                          <span className="text-[10px] text-[#6B7280]">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-sm font-semibold text-[#111111] hover:underline truncate block mt-0.5"
                        title={product.name}
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        ₹{price.toLocaleString('en-IN')} unit price
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3F4F6]">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden bg-[#FAFAF7]">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity || 1, -1)}
                        className="p-1.5 hover:bg-[#E5E7EB] text-[#111111] transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#111111]">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity || 1, 1)}
                        className="p-1.5 hover:bg-[#E5E7EB] text-[#111111] transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-extrabold text-[#111111]">
                        ₹{(price * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {buyUrl && (
                      <button
                        onClick={() => handleBuy(listing)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold rounded-[8px] transition-colors"
                      >
                        <span>Buy</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-md transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Column */}
          <div className="space-y-4">
            <div className="p-5 bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#111111]">Order & Budget Summary</h3>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#111111]">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Store Delivery</span>
                  <span className="font-semibold text-[#3FA66B]">Free / Direct Store</span>
                </div>
                {budget > 0 && (
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Budget Status</span>
                    <span className={`font-semibold ${isOverBudget ? 'text-[#E8798F]' : 'text-[#3FA66B]'}`}>
                      {isOverBudget ? 'Over Limit' : 'Within Budget'}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E5E7EB] flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#111111]">Total Estimated</span>
                  <span className="text-xl font-extrabold text-[#111111]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to="/catalog"
                  className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/budget"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs text-[#3FA66B] hover:underline font-semibold"
                >
                  <Wallet className="w-3.5 h-3.5" /> Adjust Budget Limit
                </Link>
              </div>
            </div>

            {/* Price Match Guarantee Banner */}
            <div className="p-4 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[14px] flex items-start gap-3 text-xs text-[#6B7280]">
              <ShieldCheck className="w-5 h-5 text-[#3FA66B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block font-semibold">Multi-Store Price Guarantee</strong>
                Items in your cart are automatically matched against lowest current prices on Amazon, Flipkart, and Quick-Commerce stores.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Rich Empty State */
        <div className="space-y-8">
          <div className="text-center py-12 px-4 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[20px] shadow-sm space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center mx-auto shadow-sm text-[#111111]">
              <ShoppingCart className="w-7 h-7 text-[#111111]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Your Budget Cart is empty</h3>
              <p className="text-xs text-[#6B7280] max-w-md mx-auto mt-1 leading-relaxed">
                Add products from verified store listings to automatically track your expenses against your monthly budget limit.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <Link to="/catalog" className="btn-primary py-2 px-5 text-xs inline-flex items-center gap-1.5">
                <span>Browse Catalog Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/ai-assistant" className="btn-secondary py-2 px-4 text-xs inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E8798F]" />
                <span>Ask AI Advisor</span>
              </Link>
            </div>
          </div>

          {/* Quick Preset Budget Setup */}
          {budget === 0 && (
            <div className="p-5 bg-white border border-[#E5E7EB] rounded-[16px] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#111111] flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-[#3FA66B]" /> Quick Set Monthly Budget
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">Select a starter budget to activate real-time overspending alerts</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[2000, 5000, 15000, 30000, 50000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => saveBudget(amt)}
                    className="px-3 py-1.5 bg-[#FAFAF7] hover:bg-[#EAF7EE] border border-[#E5E7EB] hover:border-[#3FA66B] rounded-[8px] text-xs font-semibold text-[#111111] transition-all"
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Budget Essentials Section */}
          {recommendedProducts.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#3FA66B]" /> Popular Budget Essentials
                  </h3>
                  <p className="text-xs text-[#6B7280]">Top-rated catalog items with lowest verified store prices</p>
                </div>
                <Link to="/catalog" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedProducts.map((prod) => {
                  const listings = prod.listings || [];
                  const prices = listings.map(l => parseFloat(l.price) || 0).filter(Boolean);
                  const lowest = prices.length > 0 ? Math.min(...prices) : prod.price || 0;
                  const cheapestListing = listings.find(l => parseFloat(l.price) === lowest) || listings[0] || {};
                  const store = cheapestListing.sellerName || cheapestListing.marketplace || 'Marketplace';
                  const isAdding = addingId === prod.id;
                  const isSuccess = addedSuccessId === prod.id;

                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-[#E5E7EB] hover:border-[#111111]/30 rounded-[14px] p-3.5 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="space-y-2.5">
                        <div className="w-full h-28 bg-[#FAFAF7] rounded-[10px] p-2 flex items-center justify-center border border-[#F3F4F6] overflow-hidden">
                          <img
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'}
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
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
                          onClick={() => handleQuickAdd(prod)}
                          disabled={isAdding}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all flex items-center gap-1 ${
                            isSuccess
                              ? 'bg-[#EAF7EE] text-[#3FA66B] border border-[#3FA66B]'
                              : 'bg-[#111111] hover:bg-[#333333] text-white shadow-sm'
                          }`}
                        >
                          {isSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Added
                            </>
                          ) : isAdding ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" /> Add
                            </>
                          )}
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
              <div className="w-7 h-7 rounded-lg bg-[#EAF7EE] text-[#3FA66B] flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">8-Store Price Comparison</h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                We continuously scrape Amazon, Flipkart, Blinkit, BigBasket, and more to guarantee the cheapest cart deal.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#E5E7EB] rounded-[14px] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFF0F3] text-[#E8798F] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">Budget Guard Overspending Alerts</h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Set custom monthly spending caps and get visual warnings when approaching your designated threshold.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#E5E7EB] rounded-[14px] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#FAFAF7] text-[#111111] flex items-center justify-center border border-[#E5E7EB]">
                <ExternalLink className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">Direct Seller Checkout</h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                One click takes you to verified item checkout pages on the winning retailer with zero middleman markup.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
