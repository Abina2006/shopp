import { BaseProvider } from './base.provider.js';

export class BlinkitProvider extends BaseProvider {
  constructor() {
    super('Blinkit');
    this.apiKey = process.env.BLINKIT_PROVIDER_KEY || null;
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
          const listing = (p.listings || []).find(l => (l.marketplace || '').toLowerCase() === 'blinkit');
          if (listing) {
            products.push(this.normalize({
              name: p.name,
              platform: 'Blinkit',
              price: listing.price,
              original_price: listing.originalPrice || listing.price,
              discount: listing.discount || 0,
              rating: listing.rating || 4.5,
              review_count: listing.reviewCount || 100,
              seller: 'Blinkit Express',
              delivery_info: '10 Mins Instant Delivery',
              image_url: p.imageUrl,
              product_url: listing.productUrl || 'https://blinkit.com',
              availability: 'IN_STOCK',
              brand: p.brand || 'Generic',
              category: p.category || 'Grocery',
              priceStatus: 'DEMO_PRICE'
            }));
          }
        }
        return products;
      } catch (err) {
        console.warn('[BlinkitProvider] mock search warning:', err.message);
        return [];
      }
    }
    try {
      // Live Blinkit API call when BLINKIT_PROVIDER_KEY is set
      const response = await fetch(`https://api.blinkit.com/v1/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!response.ok) return [];
      const json = await response.json();
      return (json.items || []).map(item => this.normalize({
        name: item.name,
        platform: 'Blinkit',
        price: item.price,
        original_price: item.mrp || item.price,
        rating: item.rating || 4.5,
        review_count: item.review_count || 100,
        seller: 'Blinkit Local Store',
        delivery_info: '10 Mins Instant Delivery',
        image_url: item.image_url || '',
        product_url: item.product_url || `https://blinkit.com/s/?q=${encodeURIComponent(query)}`,
        availability: item.in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK',
        brand: item.brand || 'Blinkit',
        category: 'Grocery'
      }));
    } catch (err) {
      console.warn('[BlinkitProvider] Search failed:', err.message);
      return [];
    }
  }
}

export default new BlinkitProvider();
