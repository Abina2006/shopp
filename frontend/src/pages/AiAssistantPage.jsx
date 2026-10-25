import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, Loader2, Bot, User, ExternalLink, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const SUGGESTIONS = [
  'Find a laptop under ₹60,000',
  'Find Kurkure under ₹30',
  'I have ₹1,000 for snacks',
  'Compare cheapest milk options',
  'Find boAt earphones under ₹1,000',
  'Show me iPhone 15 price comparison',
];

function renderFormattedText(text) {
  if (!text) return null;
  const parts = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    if (match[1] && match[2]) {
      const label = match[1];
      const url = match[2];
      if (url.startsWith('/')) {
        parts.push(
          <Link key={match.index} to={url} className="text-indigo-600 hover:text-indigo-800 underline font-semibold">
            {label}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 underline font-semibold inline-flex items-center gap-0.5"
          >
            {label}
          </a>
        );
      }
    } else if (match[3]) {
      parts.push(<strong key={match.index} className="font-semibold text-[#111111]">{match[3]}</strong>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your ShopWise AI shopping advisor. I query verified live product catalog listings to help you find the best deals, compare store prices, and shop within your budget. What are you looking for today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const budgetMatch = userMsg.match(/(?:under|below|less than|budget of|within|for)?\s*₹?\s*(\d[\d,]*)/i);
      const budgetAmount = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ''), 10) : null;

      // Extract search keyword (strip numbers and common prompt stop words)
      const cleanKeyword = userMsg
        .replace(/₹?\s?[\d,]+/g, '')
        .replace(/\b(find|show|me|get|search|for|under|below|budget|within|cheap|cheapest|options|please|can|i|have|price|comparison|compare)\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const queryLower = userMsg.toLowerCase();
      let category = '';
      if (/laptop|computer|pc|macbook|thinkpad|ideapad|pavilion|predator|rog/i.test(queryLower)) category = 'Electronics';
      else if (/phone|iphone|samsung|mobile|redmi|oneplus|pixel|realme/i.test(queryLower)) category = 'Electronics';
      else if (/headphone|earphone|earbud|audio|boat|sony|jbl|speaker/i.test(queryLower)) category = 'Electronics';
      else if (/watch|wearable|smartwatch|band|fitbit/i.test(queryLower)) category = 'Electronics';
      else if (/snack|kurkure|chips|biscuit|namkeen|cookie/i.test(queryLower)) category = 'Snacks & Beverages';
      else if (/milk|dairy|curd|paneer|cheese/i.test(queryLower)) category = 'Grocery';
      else if (/oil|tea|rice|grocery|atta|dal|spice|masala/i.test(queryLower)) category = 'Grocery';
      else if (/soap|shampoo|cream|lotion|face|hair|beauty|care/i.test(queryLower)) category = 'Personal Care';

      if (budgetAmount && budgetAmount > 0) {
        const res = await api.get('/products/budget-advisor', {
          params: { 
            budget: budgetAmount, 
            category: category || 'All',
            search: cleanKeyword || undefined
          },
        });
        const data = res.data?.data;
        const products = [];
        if (data?.topPick) products.push(data.topPick);
        if (data?.runnerUp) products.push(data.runnerUp);

        let verdict = data?.aiVerdict;
        if (!verdict) {
          verdict = `I found ${data?.totalMatching || 0} products within your ₹${budgetAmount.toLocaleString('en-IN')} budget in the catalog.`;
        }

        // Add explicit product link to text
        if (data?.topPick?.winningUrl) {
          verdict += `\n\n🔗 Store Link: [Buy on ${data.topPick.winningStore} ↗](${data.topPick.winningUrl})`;
        }

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: verdict,
          products: products,
          isBudget: true
        }]);
      } else {
        const res = await api.get('/products', { params: { search: cleanKeyword || userMsg } });
        const rawProducts = res.data?.data || [];

        if (rawProducts.length > 0) {
          const top = rawProducts.slice(0, 3).map(p => {
            const listings = p.listings || [];
            const prices = listings.map(l => parseFloat(l.price)).filter(Boolean);
            const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
            const cheapest = listings.find(l => parseFloat(l.price) === lowestPrice) || listings[0] || {};
            return {
              ...p,
              lowestPrice: lowestPrice || p.price,
              winningStore: cheapest.sellerName || cheapest.marketplace || 'Marketplace',
              winningUrl: cheapest.buyUrl || cheapest.sellerUrl || cheapest.productUrl || (p.id ? `/product/${p.id}` : '')
            };
          });

          const productList = top.map(p => {
            const buyText = p.winningUrl ? ` • [Buy on ${p.winningStore} ↗](${p.winningUrl})` : '';
            return `• **${p.name}** — ₹${p.lowestPrice?.toLocaleString('en-IN') || 'N/A'} (Lowest on ${p.winningStore}) across ${(p.listings || []).length} stores.${buyText}`;
          }).join('\n');

          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Here are the verified listings found for "${userMsg}":\n\n${productList}\n\nAll prices are grounded in the ShopWise database.`,
            products: top
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I could not find exact catalog matches for "${userMsg}". Try searching for items like "Kurkure", "Milk", "iPhone", or "Laptop".`,
            products: []
          }]);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Unable to retrieve catalog data right now. Please try again.',
        products: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="min-h-screen bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111111] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E8798F]" /> AI Shopping Advisor
        </h1>
        <p className="text-xs text-[#6B7280]">Grounded product recommendations based strictly on verified database listings</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white border border-[#E5E7EB] rounded-[16px] p-5 min-h-[460px] flex flex-col justify-between space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {/* Messages */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-[8px] bg-[#FFF0F3] text-[#E8798F] flex items-center justify-center shrink-0 border border-[#E8798F]/20">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-xl p-3.5 rounded-[12px] text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#111111] text-white font-medium whitespace-pre-line'
                    : 'bg-[#F7F7F5] text-[#111111] border border-[#E5E7EB]'
                }`}
              >
                <div className="whitespace-pre-line">
                  {renderFormattedText(msg.content)}
                </div>

                {/* Interactive Product Link Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-[#E5E7EB] space-y-2">
                    <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#E8798F]" />
                      <span>Direct Product Link{msg.products.length > 1 ? 's' : ''} & Store Deals</span>
                    </div>
                    <div className="space-y-2">
                      {msg.products.map((prod, pIdx) => {
                        const store = prod.winningStore || 'Store';
                        const buyUrl = prod.winningUrl || prod.sellerUrl || prod.buyUrl;
                        const price = prod.lowestPrice !== undefined ? prod.lowestPrice : prod.price;

                        return (
                          <div
                            key={prod.id || pIdx}
                            className="bg-white border border-[#E5E7EB] hover:border-[#111111]/30 rounded-[10px] p-2.5 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between"
                          >
                            {/* Product Info */}
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {prod.imageUrl ? (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-10 h-10 object-contain rounded-[6px] border border-[#F3F4F6] shrink-0 bg-white p-0.5"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-[6px] bg-[#F3F4F6] flex items-center justify-center shrink-0 text-slate-400">
                                  <ShoppingBag className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <Link
                                  to={`/product/${prod.id || prod.productId}`}
                                  className="font-semibold text-xs text-[#111111] hover:underline truncate block"
                                  title={prod.name}
                                >
                                  {prod.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6B7280]">
                                  {price !== null && price !== undefined && (
                                    <span className="font-bold text-[#111111]">
                                      ₹{Number(price).toLocaleString('en-IN')}
                                    </span>
                                  )}
                                  <span>•</span>
                                  <span className="bg-[#F3F4F6] text-[#374151] px-1.5 py-0.5 rounded text-[10px] font-medium">
                                    {store}
                                  </span>
                                  {prod.avgRating && (
                                    <span className="text-amber-600 font-medium">
                                      ★ {prod.avgRating}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Direct Action Link Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#F3F4F6]">
                              {buyUrl && (
                                <a
                                  href={buyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#111111] hover:bg-[#333333] text-white text-[11px] font-semibold rounded-[6px] transition-colors"
                                >
                                  <span>Buy on {store}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {prod.id && (
                                <Link
                                  to={`/product/${prod.id}`}
                                  className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-[#F7F7F5] hover:bg-[#EAEAEA] text-[#111111] text-[11px] font-medium rounded-[6px] border border-[#E5E7EB] transition-colors"
                                >
                                  <span>Details</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-[8px] bg-[#111111] text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-[#6B7280]">
              <div className="w-7 h-7 rounded-[8px] bg-[#FFF0F3] text-[#E8798F] flex items-center justify-center shrink-0 border border-[#E8798F]/20">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-[#F7F7F5] border border-[#E5E7EB] rounded-[10px] flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#111111]" /> Checking catalog listings...
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="pt-3 border-t border-[#E5E7EB] space-y-2.5">
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                onClick={() => sendMessage(sug)}
                className="px-2.5 py-1 bg-[#F7F7F5] border border-[#E5E7EB] hover:border-[#111111] text-[11px] font-medium text-[#111111] rounded-[6px] transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI for product comparisons, budget picks, or deals..."
              className="input-clean text-xs sm:text-sm py-2"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary py-2 px-5 text-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
