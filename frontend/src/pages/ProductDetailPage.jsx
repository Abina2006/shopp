import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ExternalLink, Clock, ShieldCheck, AlertTriangle, ArrowLeft, ShoppingCart, CheckCircle2, Store, Check, MessageSquare, Award, Percent, BarChart2, Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function getMarketplaceUrl(listing, productName) {
  const seller = (listing?.sellerName || '').toLowerCase().trim();
  const q = encodeURIComponent((productName || '').trim() || seller);
  if (seller === 'blinkit') return 'https://blinkit.com/s/?q=' + q;
  if (seller === 'jiomart') return 'https://www.jiomart.com/search#' + q;
  if (seller === 'zepto') return 'https://www.zepto.now.com/cn/search?query=' + q;
  if (seller.includes('swiggy')) return 'https://swiggy.com/instamart/search?query=' + q;
  if (seller === 'bigbasket') return 'https://www.bigbasket.com/ps/?q=' + q;
  if (seller === 'amazon') return 'https://www.amazon.in/s?k=' + q;
  if (seller === 'flipkart') return 'https://www.flipkart.com/search?q=' + q;
  if (seller === 'meesho') return 'https://www.meesho.com/search?q=' + q;
  const stored = listing?.buyUrl || listing?.productUrl || listing?.sellerUrl;
  if (stored && stored !== '#' && stored !== '') return stored;
  return 'https://www.google.com/search?q=' + q + '+buy+online+india';
}

function handleBuy(listing, productName) {
  const url = getMarketplaceUrl(listing, productName);
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Unable to open shopping source:', error);
  }
}

function hasValidUrl(listing) {
  return true; // always generate a safe URL via getMarketplaceUrl
}

function getBuyButtonLabel(listing) {
  const seller = listing?.sellerName || listing?.marketplace || 'Marketplace';
  if (listing?.urlType === 'product') {
    return `Buy on ${seller}`;
  }
  return `Search on ${seller}`;
}

function formatUnitPrice(price, quantity, unit) {
  if (!price || !quantity || !unit) return null;
  const p = parseFloat(price);
  const q = parseFloat(quantity);
  const u = (unit || '').toLowerCase().trim();
  if (isNaN(p) || isNaN(q) || q <= 0 || p <= 0) return null;

  if (u === 'g' || u === 'gm' || u === 'grams' || u === 'gram') {
    const perKg = (p / q) * 1000;
    return `₹${perKg.toFixed(2)}/kg`;
  }
  if (u === 'kg' || u === 'kgs' || u === 'kilogram') {
    const perKg = p / q;
    return `₹${perKg.toFixed(2)}/kg`;
  }
  if (u === 'ml' || u === 'milliliter') {
    const perL = (p / q) * 1000;
    return `₹${perL.toFixed(2)}/L`;
  }
  if (u === 'l' || u === 'liter' || u === 'liters' || u === 'litre' || u === 'litres') {
    const perL = p / q;
    return `₹${perL.toFixed(2)}/L`;
  }
  if (['pieces', 'piece', 'pc', 'pcs', 'egg', 'eggs'].includes(u)) {
    const perPiece = p / q;
    return `₹${perPiece.toFixed(2)}/item`;
  }
  return `₹${(p / q).toFixed(2)} / ${unit}`;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingCart, setAddingCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data?.data || null);
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (listing) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (!listing?.id) {
      setCartError('This listing cannot be added to cart (missing ID).');
      setTimeout(() => setCartError(''), 4000);
      return;
    }
    setAddingCart(true);
    setCartError('');
    try {
      await api.post('/cart', {
        listingId: listing.id,
        quantity: 1,
        unit: product?.baseUnit || null
      });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      console.error('Cart add error:', err);
      const msg = err.response?.data?.message || 'Failed to add to cart. Please try again.';
      setCartError(msg);
      setTimeout(() => setCartError(''), 5000);
    } finally {
      setAddingCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 bg-white">
        <AlertTriangle className="w-12 h-12 text-[#E8798F]" />
        <h2 className="text-lg font-bold text-[#111111]">Product Not Found</h2>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const listings = product.listings || [];
  const validListings = listings.filter(l => {
    const p = parseFloat(l.price);
    return !isNaN(p) && p > 0 && l.availability !== 'OUT_OF_STOCK' && l.availability !== 'UNAVAILABLE';
  });

  const prices = validListings.map(l => parseFloat(l.price));
  const bestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : null;
  const bestListing = validListings.find(l => parseFloat(l.price) === bestPrice) || listings[0];
  const savings = highestPrice && bestPrice && highestPrice > bestPrice ? highestPrice - bestPrice : 0;
  const discount = highestPrice > 0 ? Math.round((savings / highestPrice) * 100) : 0;
  
  const quantity = product.quantity || product.baseQuantity;
  const unit = product.unit || product.baseUnit;
  const isGrocery = product.categoryType === 'GROCERY' || ['Grocery', 'Snacks & Beverages', 'Groceries'].includes(product.category);
  const unitPriceStr = isGrocery && bestPrice && quantity && unit ? formatUnitPrice(bestPrice, quantity, unit) : null;

  // Best unit value calculation
  const listingsWithUnit = validListings.filter(l => parseFloat(l.unitPrice) > 0);
  const bestUnitListing = listingsWithUnit.length > 0
    ? [...listingsWithUnit].sort((a, b) => parseFloat(a.unitPrice) - parseFloat(b.unitPrice))[0]
    : bestListing;
  const bestUnitPriceStr = bestUnitListing && isGrocery && quantity && unit
    ? formatUnitPrice(parseFloat(bestUnitListing.price), quantity, unit)
    : null;

  const allReviews = listings.flatMap(l => l.reviews || []);
  const benefitsList = Array.isArray(product.benefits) ? product.benefits : (product.benefits ? JSON.parse(product.benefits) : []);

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
            <h2 className="text-2xl font-bold text-[#111111]">Sign In to View Product Details</h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Price breakdown across 8 stores, stock verification, and direct store links are available to registered users.
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
      {/* Demo Notice Banner */}
      <div className="p-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[12px] text-xs text-[#6B7280] flex items-center justify-between flex-wrap gap-2">
        <span><strong>Demo Data:</strong> Prices and availability are illustrative demo marketplace data for price comparison testing.</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#3FA66B] bg-[#EAF7EE] px-2 py-0.5 rounded-[4px]">DEMO DATA</span>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
        <Link to="/" className="hover:text-[#111111] flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </Link>
        <span>/</span>
        <Link to={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-[#111111] font-medium">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#111111] font-semibold truncate max-w-[220px]">{product.name}</span>
      </div>

      {/* Comparison Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 🏆 LOWEST TOTAL PRICE */}
        <div className="p-4 bg-[#EAF7EE] border border-[#3FA66B]/30 rounded-[16px] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#277A4D]">
            <Award className="w-4 h-4 text-[#3FA66B]" />
            <span>🏆 LOWEST TOTAL PRICE</span>
          </div>
          <p className="text-xl font-extrabold text-[#111111]">
            ₹{bestPrice ? bestPrice.toLocaleString('en-IN') : 'N/A'}
          </p>
          <p className="text-xs text-[#6B7280]">
            Available on <strong className="text-[#111111]">{bestListing?.sellerName || 'Marketplace'}</strong>
          </p>
        </div>

        {/* 💰 SAVINGS */}
        <div className="p-4 bg-[#FFF0F3] border border-[#E8798F]/30 rounded-[16px] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#C95F75]">
            <Percent className="w-4 h-4 text-[#E8798F]" />
            <span>💰 SAVINGS</span>
          </div>
          <p className="text-xl font-extrabold text-[#111111]">
            ₹{savings.toLocaleString('en-IN')} <span className="text-xs font-normal text-[#C95F75]">({discount}% OFF)</span>
          </p>
          <p className="text-xs text-[#6B7280]">
            Compared to highest platform listing
          </p>
        </div>

        {/* 📊 BEST UNIT VALUE */}
        <div className="p-4 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[16px] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
            <BarChart2 className="w-4 h-4 text-[#3FA66B]" />
            <span>📊 BEST UNIT VALUE</span>
          </div>
          <p className="text-xl font-extrabold text-[#3FA66B]">
            {bestUnitPriceStr || unitPriceStr || (bestPrice ? `₹${bestPrice} / unit` : 'N/A')}
          </p>
          <p className="text-xs text-[#6B7280]">
            Best value on <strong className="text-[#111111]">{bestUnitListing?.sellerName || bestListing?.sellerName}</strong>
          </p>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#E5E7EB] rounded-[18px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {/* Product Image Container */}
        <div className="lg:col-span-5 flex items-center justify-center bg-[#F7F7F5] border border-[#E5E7EB] rounded-[14px] p-6 aspect-square max-h-[420px]">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'}
            alt={product.imageAlt || product.name}
            className="w-full h-full object-contain"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'; }}
          />
        </div>

        {/* Product Info */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-[6px] font-semibold bg-[#F7F7F5] text-[#111111] border border-[#E5E7EB]">
                {product.category}
              </span>
              <span className="text-xs text-[#6B7280] font-medium">Brand: <span className="text-[#111111] font-bold">{product.brand}</span></span>
              {isGrocery && product.baseQuantity && product.baseUnit && (
                <span className="text-xs text-[#6B7280] font-medium">• Size: <span className="text-[#111111] font-bold">{product.baseQuantity} {product.baseUnit}</span></span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-[#111111] leading-snug">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Product Benefits */}
            {benefitsList.length > 0 && (
              <div className="p-3.5 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[12px] space-y-2">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Product Features & Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {benefitsList.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs text-[#374151]">
                      <Check className="w-3.5 h-3.5 text-[#3FA66B] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {bestListing && hasValidUrl(bestListing) ? (
              <button
                onClick={() => handleBuy(bestListing, product?.name)}
                className="btn-primary py-2.5 px-6 text-sm flex-1 sm:flex-initial"
              >
                {getBuyButtonLabel(bestListing)} <ExternalLink className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-2.5 bg-[#F7F7F5] text-[#9CA3AF] text-sm font-medium rounded-[8px] border border-[#E5E7EB] cursor-not-allowed flex items-center gap-2"
              >
                Product link unavailable
              </button>
            )}

            {bestListing ? (
              <button
                onClick={() => handleAddToCart(bestListing)}
                disabled={addingCart}
                className={`btn-secondary py-2.5 px-5 text-sm transition-all ${addingCart ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {cartSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#3FA66B]" /> Added to Cart!
                  </>
                ) : addingCart ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin inline-block" /> Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-[#111111]" /> Add to Budget Cart
                  </>
                )}
              </button>
            ) : null}
          </div>

          {/* Cart error feedback */}
          {cartError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#FFF0F3] border border-[#E8798F]/40 rounded-[8px] text-xs text-[#C95F75] font-medium animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {cartError}
            </div>
          )}
        </div>
      </div>

      {/* Platform Comparison List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">Marketplace Price Comparison</h2>
            <p className="text-xs text-[#6B7280]">Official allowed marketplaces for this category. Normalized prices & units.</p>
          </div>
          <span className="text-xs text-[#6B7280] font-medium flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-[#111111]" /> {listings.length} {listings.length === 1 ? 'store available' : 'stores available'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {listings.map((listing, idx) => {
            const price = parseFloat(listing.price) || 0;
            const isBest = price === bestPrice;
            const validUrl = hasValidUrl(listing);
            const listingUnitPrice = isGrocery ? formatUnitPrice(price, product.baseQuantity, product.baseUnit) : null;
            const priceStatusLabel = listing.priceStatus === 'LIVE_VERIFIED' ? 'LIVE / VERIFIED' : (listing.priceStatus || 'DEMO PRICE');

            return (
              <div
                key={listing.id || idx}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[14px] border transition-all ${
                  isBest
                    ? 'bg-[#EAF7EE]/50 border-[#3FA66B]/40'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                {/* Platform info */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-[8px] text-xs font-bold text-[#111111] shrink-0 shadow-sm">
                    {listing.sellerName}
                  </div>

                  {isBest && (
                    <span className="bg-[#3FA66B] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                      Lowest Price
                    </span>
                  )}

                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F7F7F5] border border-[#E5E7EB] px-2 py-0.5 rounded-[4px] text-[#6B7280]">
                    {priceStatusLabel}
                  </span>

                  {listing.deliveryTime && (
                    <span className="text-xs text-[#6B7280] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#9CA3AF]" /> {listing.deliveryTime}
                    </span>
                  )}
                </div>

                {/* Pricing & Buy Button */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-[#111111]">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {listing.originalPrice && parseFloat(listing.originalPrice) > price && (
                        <span className="text-xs text-[#9CA3AF] line-through">
                          ₹{parseFloat(listing.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {listingUnitPrice && (
                      <span className="text-[11px] text-[#277A4D] block font-bold">
                        {listingUnitPrice}
                      </span>
                    )}
                  </div>

                  {validUrl ? (
                    <button
                      onClick={() => handleBuy(listing, product?.name)}
                      className="btn-primary py-2 px-4 text-xs shrink-0"
                    >
                      {getBuyButtonLabel(listing)} <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-2 bg-[#F7F7F5] text-[#9CA3AF] text-xs font-medium rounded-[8px] border border-[#E5E7EB] cursor-not-allowed shrink-0 flex items-center gap-1"
                      title="Product link unavailable"
                    >
                      Product link unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white border border-[#E5E7EB] rounded-[18px] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#111111]" />
          <h2 className="text-lg font-bold text-[#111111]">Customer Ratings & Reviews</h2>
        </div>

        {allReviews.length > 0 ? (
          <div className="space-y-3">
            {allReviews.map((rev, rIdx) => (
              <div key={rev.id || rIdx} className="p-4 bg-[#F7F7F5] border border-[#E5E7EB] rounded-[12px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111]">{rev.reviewerName || 'Verified Buyer'}</span>
                  <div className="flex items-center gap-1 text-xs text-[#3FA66B]">
                    <Star className="w-3.5 h-3.5 fill-[#3FA66B]" />
                    <span className="font-bold">{rev.rating || 5.0}</span>
                  </div>
                </div>
                <p className="text-xs text-[#6B7280]">{rev.reviewText}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#F7F7F5] border border-[#E5E7EB] rounded-[12px] text-center text-xs text-[#6B7280]">
            No reviews available yet for this product.
          </div>
        )}
      </section>
    </div>
  );
}
