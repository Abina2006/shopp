import { BaseProvider } from './base.provider.js';

export class ZeptoProvider extends BaseProvider {
  constructor() {
    super('Zepto');
    this.apiKey = process.env.ZEPTO_PROVIDER_KEY || null;
  }

  getStatus() {
    return this.apiKey ? 'CONNECTED' : 'NOT_CONFIGURED';
  }

  async searchProducts(query) {
    if (!this.apiKey) {
      try {
        const { searchMockCatalog } = await import('../services/mockSearchEngine.service.js');
        const results = searchMockCatalog(query);
        const products = [];
        for (const p of results) {
          const listing = (p.listings || []).find(l => (l.marketplace || '').toLowerCase() === 'zepto');
          if (listing) {
            products.push(this.normalize({
              name: p.name,
              platform: 'Zepto',
              price: listing.price,
              original_price: listing.originalPrice || listing.price,
              discount: listing.discount || 0,
              rating: listing.rating || 4.6,
              review_count: listing.reviewCount || 100,
              seller: 'Zepto Darkstore',
              delivery_info: '8 Mins Instant Delivery',
              image_url: p.imageUrl,
              product_url: listing.productUrl || 'https://www.zeptonow.com',
              availability: 'IN_STOCK',
              brand: p.brand || 'Generic',
              category: p.category || 'Grocery',
              priceStatus: 'DEMO_PRICE'
            }));
          }
        }
        return products;
      } catch (err) {
        console.warn('[ZeptoProvider] mock search warning:', err.message);
        return [];
      }
    }
    try {
      const response = await fetch(`https://api.zeptonow.com/v1/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!response.ok) return [];
      const json = await response.json();
      return (json.items || []).map(item => this.normalize({
        name: item.name,
        platform: 'Zepto',
        price: item.price,
        original_price: item.mrp || item.price,
        rating: item.rating || 4.6,
        review_count: item.review_count || 120,
        seller: 'Zepto Darkstore',
        delivery_info: '8 Mins Instant Delivery',
        image_url: item.image_url || '',
        product_url: item.product_url || `https://zepto.com/search?q=${encodeURIComponent(query)}`,
        availability: item.in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK',
        brand: item.brand || 'Zepto',
        category: 'Grocery'
      }));
    } catch (err) {
      console.warn('[ZeptoProvider] Search failed:', err.message);
      return [];
    }
  }
}

export default new ZeptoProvider();
