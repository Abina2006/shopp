import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import api from '../services/api';

function handleBuy(url) {
  if (!url || url === '#' || url === '') return;
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error('Failed to open link:', err);
  }
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparedData, setComparedData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const json = res.data;
        if (json.success && json.data) {
          setAvailableProducts(json.data);
          const idsFromParam = searchParams.get('ids');
          if (idsFromParam) {
            const parsed = idsFromParam.split(',').map(s => s.trim()).filter(Boolean);
            setSelectedIds(parsed);
          } else if (json.data.length >= 2) {
            setSelectedIds(json.data.slice(0, 3).map(p => p.id));
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setComparedData([]);
      return;
    }

    setLoading(true);
    api.get(`/products/compare?ids=${selectedIds.join(',')}`)
      .then(res => {
        const json = res.data;
        if (json.success) {
          setComparedData(json.data || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    setSearchParams({ ids: selectedIds.join(',') });
  }, [selectedIds]);

  const handleToggleProduct = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert('You can compare up to 4 products at a time.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111111]">
          Side-by-Side Product Comparison
        </h1>
        <p className="text-xs text-[#6B7280]">Compare prices, stores, and savings metrics across selected products</p>
      </div>

      {/* Product Selector Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#111111]">
            Select products to compare ({selectedIds.length}/4 selected)
          </span>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear Selection
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {availableProducts.map((prod) => {
            const isSelected = selectedIds.includes(prod.id);
            return (
              <button
                key={prod.id}
                onClick={() => handleToggleProduct(prod.id)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-[#111111] border-[#111111] text-white shadow-sm'
                    : 'bg-[#F7F7F5] hover:bg-[#EAEAEA] border-[#E5E7EB] text-[#111111]'
                }`}
              >
                <span>{isSelected ? '✓' : '+'}</span>
                <span className="truncate max-w-[180px]">{prod.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#6B7280]">Loading comparison data...</p>
        </div>
      ) : comparedData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-[700px] bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F7F7F5]">
                  <th className="p-4 w-40 text-[#6B7280] font-semibold uppercase tracking-wider">Metrics</th>
                  {comparedData.map((p) => (
                    <th key={p.id} className="p-4 border-l border-[#E5E7EB] min-w-[200px]">
                      <div className="space-y-2">
                        <div className="h-28 w-full bg-[#F7F7F5] rounded-[10px] p-2 flex items-center justify-center border border-[#E5E7EB]">
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-bold uppercase">{p.category}</span>
                        <h3 className="text-xs font-bold text-[#111111] line-clamp-2">{p.name}</h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                <tr>
                  <td className="p-4 font-semibold text-[#6B7280]">Lowest Price</td>
                  {comparedData.map((p) => (
                    <td key={p.id} className="p-4 border-l border-[#E5E7EB]">
                      <span className="text-sm font-extrabold text-[#111111]">
                        ₹{p.minPrice ? p.minPrice.toLocaleString('en-IN') : 'N/A'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#6B7280]">Highest Price</td>
                  {comparedData.map((p) => (
                    <td key={p.id} className="p-4 border-l border-[#E5E7EB] text-[#9CA3AF]">
                      ₹{p.maxPrice ? p.maxPrice.toLocaleString('en-IN') : 'N/A'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#6B7280]">Savings Potential</td>
                  {comparedData.map((p) => (
                    <td key={p.id} className="p-4 border-l border-[#E5E7EB]">
                      {p.savingsPercent > 0 ? (
                        <span className="badge-best-price">
                          Save ₹{p.priceDifference?.toLocaleString('en-IN')} ({p.savingsPercent}%)
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF]">Uniform Pricing</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#6B7280]">Lowest Platform</td>
                  {comparedData.map((p) => (
                    <td key={p.id} className="p-4 border-l border-[#E5E7EB]">
                      <span className="px-2 py-0.5 bg-[#EAF7EE] border border-[#3FA66B]/30 text-[#3FA66B] font-bold rounded-[6px]">
                        {p.bestDealListing?.sellerName || 'Amazon'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#6B7280]">Actions</td>
                  {comparedData.map((p) => (
                    <td key={p.id} className="p-4 border-l border-[#E5E7EB]">
                      <div className="flex flex-col gap-2">
                        <Link to={`/product/${p.id}`} className="btn-secondary py-1.5 px-3 text-center text-xs">
                          View Details
                        </Link>
                        {p.bestDealListing?.sellerUrl && (
                          <button
                            onClick={() => handleBuy(p.bestDealListing.productUrl || p.bestDealListing.sellerUrl)}
                            className="btn-primary py-1.5 px-3 text-xs"
                          >
                            Buy on {p.bestDealListing.sellerName} <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-[#F7F7F5] border border-[#E5E7EB] rounded-[16px] space-y-2">
          <p className="text-sm font-semibold text-[#111111]">No products selected for comparison</p>
          <p className="text-xs text-[#6B7280]">Select at least 2 items from the selector above to compare side-by-side.</p>
        </div>
      )}
    </div>
  );
}
