import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Tag, Store, ShieldCheck } from 'lucide-react';
import { getReliableProductImage } from '../utils/productImages';

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

export default function ProductCard({ product, requestedQuantity }) {
  if (!product) return null;

  const listings = product.listings || [];
  const prices = listings.map(l => parseFloat(l.price) || 0).filter(p => p > 0);
  const bestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : null;
  const bestListing = listings.find(l => parseFloat(l.price) === bestPrice);
  const savings = highestPrice && bestPrice && highestPrice > bestPrice ? highestPrice - bestPrice : 0;
  const discount = highestPrice > 0 ? Math.round((savings / highestPrice) * 100) : 0;
  const rating = listings.find(l => l.rating)?.rating || null;

  const quantity = product.quantity || product.baseQuantity;
  const unit = product.unit || product.baseUnit;
  const isGrocery = product.categoryType === 'GROCERY' || ['Grocery', 'Snacks & Beverages', 'Groceries'].includes(product.category);
  const unitPriceStr = isGrocery && bestPrice && quantity && unit ? formatUnitPrice(bestPrice, quantity, unit) : null;

  // Honest price status label
  const priceStatusLabel = bestListing?.priceStatus === 'LIVE_VERIFIED' ? 'LIVE / VERIFIED' : (bestListing?.priceStatus || 'DEMO PRICE');

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden hover:border-[#3FA66B]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square bg-[#FAFAF7] overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.imageUrl || getReliableProductImage(product)}
          alt={product.imageAlt || product.name}
          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const fallback = getReliableProductImage(product);
            if (e.target.src !== fallback) {
              e.target.src = fallback;
            }
          }}
        />

        {/* Discount / Quantity Badge */}
        {discount > 0 ? (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#FFF0F3] text-[#C95F75] text-[11px] font-bold rounded-[6px] flex items-center gap-1 border border-[#E8798F]/20">
            <Tag className="w-3 h-3" />
            {discount}% OFF
          </div>
        ) : isGrocery && quantity && unit ? (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-white text-[#6B7280] text-[11px] font-medium rounded-[6px] border border-[#E5E7EB]">
            {quantity} {unit}
          </div>
        ) : null}

        {/* Store Count Badge */}
        {listings.length > 0 && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/95 text-[#6B7280] text-[11px] font-medium rounded-[6px] border border-[#E5E7EB] flex items-center gap-1 shadow-sm">
            <Store className="w-3 h-3 text-[#111111]" />
            {listings.length} {listings.length === 1 ? 'store' : 'stores'}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
            <span className="text-[#6B7280] font-semibold uppercase tracking-wider">
              {product.category || 'General'}
            </span>
            <span className="text-[#9CA3AF] font-medium truncate max-w-[110px]">
              {product.brand}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-[#111111] line-clamp-2 leading-snug group-hover:text-black transition-colors">
            {product.name}
          </h3>

          {/* Requested Quantity Comparison Note */}
          {requestedQuantity && quantity && (
            <div className="mt-1.5 text-[11px] bg-[#EAF7EE] text-[#277A4D] px-2 py-1 rounded-[6px] font-medium flex items-center justify-between">
              <span>Need: {requestedQuantity}</span>
              <span>Pack: {quantity} {unit || 'pcs'}</span>
            </div>
          )}
        </div>

        {/* Rating & Unit Price */}
        <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB]/80 text-xs">
          <div className="flex items-center gap-1.5">
            {rating ? (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#EAF7EE] rounded-[4px] border border-[#3FA66B]/20">
                <Star className="w-3 h-3 text-[#3FA66B] fill-[#3FA66B]" />
                <span className="text-xs font-semibold text-[#111111]">{rating.toFixed(1)}</span>
                <span className="text-[10px] text-[#277A4D] font-medium">(Demo)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-[#3FA66B]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-medium">Demo Product</span>
              </div>
            )}
          </div>

          {/* Grocery Unit Price */}
          {unitPriceStr && (
            <span className="text-[11px] text-[#277A4D] font-bold bg-[#EAF7EE] px-2 py-0.5 rounded-[4px]">
              {unitPriceStr}
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-1 flex items-center justify-between">
          <div>
            {bestPrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-[#111111] tracking-tight">
                  ₹{bestPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#6B7280] font-bold uppercase">{priceStatusLabel}</span>
              </div>
            ) : (
              <span className="text-xs text-[#6B7280]">Price unavailable</span>
            )}

            {bestListing?.sellerName && (
              <p className="text-[11px] text-[#3FA66B] font-medium">
                Lowest on <span className="font-bold text-[#111111]">{bestListing.sellerName}</span>
              </p>
            )}
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#111111] text-white text-xs font-semibold rounded-[8px] group-hover:bg-[#2A2A2A] transition-all">
            Compare <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
