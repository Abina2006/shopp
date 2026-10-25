import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#2A2A2A] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#2A2A2A] rounded-lg flex items-center justify-center border border-[#3FA66B]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#3FA66B]" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                SHOPWISE <span className="text-[#3FA66B]">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Compare smarter. Shop better. Verified price comparisons across India's top electronics and grocery shopping apps.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Shop Categories</h4>
            <div className="space-y-2 text-[#9CA3AF]">
              <FooterLink to="/categories" label="All Categories" />
              <FooterLink to="/search?q=smartphones" label="Smartphones" />
              <FooterLink to="/search?q=laptops" label="Laptops" />
              <FooterLink to="/search?q=dairy" label="Dairy & Milk" />
              <FooterLink to="/search?q=snacks" label="Snacks & Munchies" />
            </div>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Features</h4>
            <div className="space-y-2 text-[#9CA3AF]">
              <FooterLink to="/ai-assistant" label="AI Shopping Advisor" />
              <FooterLink to="/budget" label="Budget Guard" />
              <FooterLink to="/cart" label="Budget Cart" />
              <FooterLink to="/wishlist" label="Saved Wishlist" />
            </div>
          </div>

          {/* Platforms Supported */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Supported Platforms</h4>
            <div className="space-y-1 text-[11px] text-[#9CA3AF]">
              <p><span className="text-[#3FA66B] font-medium">Electronics:</span> Amazon, Flipkart, Meesho</p>
              <p><span className="text-[#3FA66B] font-medium">Grocery:</span> Blinkit, Swiggy Instamart, Zepto, BigBasket, JioMart</p>
              <p className="pt-2 text-[10px] text-[#6B7280]">All product links open official store pages in a secure new tab.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6B7280]">
          <p>© {new Date().getFullYear()} ShopWise AI. All product prices and availability are indicative.</p>
          <p className="text-[#3FA66B]/60">Compare smarter. Shop better.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }) {
  return (
    <Link to={to} className="block hover:text-[#3FA66B] transition-colors">
      {label}
    </Link>
  );
}
