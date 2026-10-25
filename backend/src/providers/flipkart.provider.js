/**
 * Flipkart Product Provider for ShopWise AI.
 *
 * NOTE: Flipkart Affiliate API has been officially discontinued.
 * Flipkart currently has no publicly accessible product search API.
 * This provider returns curated mock data matching the normalized schema.
 *
 * If Flipkart releases a new official API in the future, replace the
 * _mockSearch() call in searchProducts() with the real API call.
 *
 * Env var: FLIPKART_API_KEY (placeholder — not used until official API exists)
 */

import { BaseProvider } from './base.provider.js';
import { searchMockCatalog } from '../services/mockSearchEngine.service.js';

const MOCK_CATALOG = {
  'headphone': [
    {
      name: 'Sony WH-CH720N Wireless Noise Cancelling Headphones',
      brand: 'Sony', category: 'Audio',
      price: 7490, original_price: 12990, discount: 42, rating: 4.3, review_count: 9200,
      seller: 'RetailNet', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=sony+wh-ch720n',
      availability: 'In Stock',
    },
    {
      name: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
      brand: 'boAt', category: 'Audio',
      price: 999, original_price: 2990, discount: 67, rating: 4.1, review_count: 62000,
      seller: 'boAt Lifestyle', delivery_info: '3-5 Days',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=boat+rockerz+450',
      availability: 'In Stock',
    },
    {
      name: 'JBL Tune 670NC Wireless Headphones',
      brand: 'JBL', category: 'Audio',
      price: 5499, original_price: 9999, discount: 45, rating: 4.2, review_count: 4300,
      seller: 'Flipkart Assured', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=jbl+tune+670nc',
      availability: 'In Stock',
    },
  ],
  'earbud': [
    {
      name: 'Samsung Galaxy Buds3 Pro TWS Earbuds',
      brand: 'Samsung', category: 'Audio',
      price: 13999, original_price: 19999, discount: 30, rating: 4.4, review_count: 5100,
      seller: 'Samsung India', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=samsung+galaxy+buds3+pro',
      availability: 'In Stock',
    },
    {
      name: 'Apple AirPods Pro (2nd Gen) with USB-C',
      brand: 'Apple', category: 'Audio',
      price: 18990, original_price: 24900, discount: 24, rating: 4.6, review_count: 14800,
      seller: 'Flipkart Assured', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=airpods+pro+2',
      availability: 'In Stock',
    },
  ],
  'phone': [
    {
      name: 'Samsung Galaxy S24 (5G) 256GB',
      brand: 'Samsung', category: 'Smartphones',
      price: 53999, original_price: 74999, discount: 28, rating: 4.5, review_count: 9800,
      seller: 'Samsung India Electronics', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=samsung+galaxy+s24',
      availability: 'In Stock',
    },
    {
      name: 'Redmi Note 13 Pro+ 5G (256GB, 12GB RAM)',
      brand: 'Redmi', category: 'Smartphones',
      price: 28999, original_price: 35999, discount: 19, rating: 4.4, review_count: 18900,
      seller: 'Flipkart Assured', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1512499617640-c2f999108c72?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=redmi+note+13+pro+plus',
      availability: 'In Stock',
    },
  ],
  'laptop': [
    {
      name: 'ASUS VivoBook 15 (Intel Core i5-13th Gen, 16GB RAM, 512GB SSD)',
      brand: 'ASUS', category: 'Computers',
      price: 51990, original_price: 74990, discount: 31, rating: 4.3, review_count: 7200,
      seller: 'ASUS Exclusive Store', delivery_info: '3-5 Days',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=asus+vivobook+15+i5',
      availability: 'In Stock',
    },
  ],
  'watch': [
    {
      name: 'Noise ColorFit Ultra 3 Smartwatch (46mm AMOLED)',
      brand: 'Noise', category: 'Wearables',
      price: 2799, original_price: 7999, discount: 65, rating: 4.0, review_count: 28000,
      seller: 'GoNoise', delivery_info: '3-4 Days',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=noise+colorfit+ultra+3',
      availability: 'In Stock',
    },
  ],
  'default': [
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony', category: 'Audio',
      price: 27990, original_price: 34990, discount: 20, rating: 4.6, review_count: 9400,
      seller: 'RetailNet', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=sony+wh1000xm5',
      availability: 'In Stock',
    },
    {
      name: 'boAt Airdopes 141 TWS Earbuds',
      brand: 'boAt', category: 'Audio',
      price: 899, original_price: 2990, discount: 70, rating: 4.0, review_count: 88000,
      seller: 'boAt Lifestyle', delivery_info: '3-5 Days',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
      product_url: 'https://www.flipkart.com/search?q=boat+airdopes+141',
      availability: 'In Stock',
    },
  ],
};

class FlipkartProvider extends BaseProvider {
  constructor() {
    super('Flipkart');
    this.apiKey = process.env.FLIPKART_PROVIDER_KEY || null;
  }

  async searchProducts(query) {
    if (this.apiKey) {
      console.log('[Flipkart] Real API key detected (Affiliate API TODO).');
    }
    return this._mockSearch(query);
  }

  async getProductDetails(productId) {
    const all = Object.values(MOCK_CATALOG).flat();
    const match = all.find(p => p.product_url.includes(productId));
    return match ? this.normalize({ ...match, platform: 'Flipkart' }) : null;
  }

  _mockSearch(query) {
    let products = [];
    try {
      const results = searchMockCatalog(query);
      for (const p of results) {
        const listing = (p.listings || []).find(l => (l.marketplace || '').toLowerCase() === 'flipkart');
        if (listing) {
          products.push({
            name: p.name,
            brand: p.brand || 'Generic',
            category: p.category || 'General',
            price: listing.price,
            original_price: listing.originalPrice || listing.price,
            discount: listing.discount || 0,
            rating: listing.rating || 4.5,
            review_count: listing.reviewCount || 100,
            seller: 'Flipkart',
            delivery_info: '2-3 Days',
            image_url: p.imageUrl,
            product_url: listing.productUrl || 'https://www.flipkart.com',
            availability: 'In Stock',
            priceStatus: 'DEMO_PRICE'
          });
        }
      }
    } catch (err) {
      console.warn('[FlipkartProvider] catalog search warning:', err.message);
    }

    if (products.length === 0) {
      const q = query.toLowerCase();
      for (const [keyword, items] of Object.entries(MOCK_CATALOG)) {
        if (keyword !== 'default' && q.includes(keyword)) {
          products = [...products, ...items];
        }
      }
    }

    const seen = new Set();
    const unique = products.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });

    return unique.map(p => this.normalize({ ...p, platform: 'Flipkart' }));
  }
}

export default new FlipkartProvider();
