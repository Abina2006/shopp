import { BaseProvider } from './base.provider.js';

export class JioMartProvider extends BaseProvider {
  constructor() {
    super('JioMart');
    this.apiKey = process.env.JIOMART_PROVIDER_KEY || null;
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
          const listing = (p.listings || []).find(l => (l.marketplace || '').toLowerCase() === 'jiomart');
          if (listing) {
            products.push(this.normalize({
              name: p.name,
              platform: 'JioMart',
              price: listing.price,
              original_price: listing.originalPrice || listing.price,
              discount: listing.discount || 0,
              rating: listing.rating || 4.4,
              review_count: listing.reviewCount || 100,
              seller: 'JioMart Express',
              delivery_info: 'Tomorrow Delivery',
              image_url: p.imageUrl,
              product_url: listing.productUrl || 'https://www.jiomart.com',
              availability: 'IN_STOCK',
              brand: p.brand || 'Generic',
              category: p.category || 'Grocery',
              priceStatus: 'DEMO_PRICE'
            }));
          }
        }
        return products;
      } catch (err) {
        console.warn('[JioMartProvider] mock search warning:', err.message);
        return [];
      }
    }
    try {
      const response = await fetch(`https://api.jiomart.com/v1/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!response.ok) return [];
      const json = await response.json();
      return (json.items || []).map(item => this.normalize({
        name: item.name,
        platform: 'JioMart',
        price: item.price,
        original_price: item.mrp || item.price,
        rating: item.rating || 4.4,
        review_count: item.review_count || 200,
        seller: 'JioMart',
        delivery_info: 'Tomorrow Delivery',
        image_url: item.image_url || '',
        product_url: item.product_url || `https://jiomart.com/search/${encodeURIComponent(query)}`,
        availability: item.in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK',
        brand: item.brand || 'JioMart',
        category: 'Grocery'
      }));
    } catch (err) {
      console.warn('[JioMartProvider] Search failed:', err.message);
      return [];
    }
  }
}

export default new JioMartProvider();
