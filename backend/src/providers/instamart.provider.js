import { BaseProvider } from './base.provider.js';

export class InstamartProvider extends BaseProvider {
  constructor() {
    super('Swiggy Instamart');
    this.apiKey = process.env.INSTAMART_PROVIDER_KEY || null;
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
          const listing = (p.listings || []).find(l => (l.marketplace || '').toLowerCase() === 'swiggy instamart' || (l.marketplace || '').toLowerCase() === 'instamart');
          if (listing) {
            products.push(this.normalize({
              name: p.name,
              platform: 'Swiggy Instamart',
              price: listing.price,
              original_price: listing.originalPrice || listing.price,
              discount: listing.discount || 0,
              rating: listing.rating || 4.5,
              review_count: listing.reviewCount || 100,
              seller: 'Swiggy Instamart',
              delivery_info: '12 Mins Instant Delivery',
              image_url: p.imageUrl,
              product_url: listing.productUrl || 'https://www.swiggy.com/instamart',
              availability: 'IN_STOCK',
              brand: p.brand || 'Generic',
              category: p.category || 'Grocery',
              priceStatus: 'DEMO_PRICE'
            }));
          }
        }
        return products;
      } catch (err) {
        console.warn('[InstamartProvider] mock search warning:', err.message);
        return [];
      }
    }
    try {
      const response = await fetch(`https://api.swiggy.com/instamart/v1/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      if (!response.ok) return [];
      const json = await response.json();
      return (json.items || []).map(item => this.normalize({
        name: item.name,
        platform: 'Swiggy Instamart',
        price: item.price,
        original_price: item.mrp || item.price,
        rating: item.rating || 4.5,
        review_count: item.review_count || 100,
        seller: 'Swiggy Instamart',
        delivery_info: '12 Mins Delivery',
        image_url: item.image_url || '',
        product_url: item.product_url || `https://swiggy.com/instamart/search?query=${encodeURIComponent(query)}`,
        availability: item.in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK',
        brand: item.brand || 'Instamart',
        category: 'Grocery'
      }));
    } catch (err) {
      console.warn('[InstamartProvider] Search failed:', err.message);
      return [];
    }
  }
}

export default new InstamartProvider();
