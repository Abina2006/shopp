/**
 * Amazon Product Provider for ShopWise AI.
 *
 * NOTE: Amazon Product Advertising API (PAAPI 5) requires an approved affiliate
 * account (amazon.in affiliate program). Without an approved key, this provider
 * returns curated mock data that matches the same normalized schema.
 *
 * When you get an API key, replace the _mockSearch() call in searchProducts()
 * with the real PAAPI 5 call using the 'paapi5-nodejs-sdk' npm package.
 *
 * API docs: https://webservices.amazon.in/paapi5/documentation/
 * Env var: AMAZON_API_KEY (not used yet — placeholder for real integration)
 */

import { BaseProvider } from './base.provider.js';
import { searchMockCatalog } from '../services/mockSearchEngine.service.js';

// Mock product catalog — realistic Indian e-commerce data
const MOCK_CATALOG = {
  'headphone': [
    {
      name: 'Sony WH-CH720N Wireless Noise Cancelling Headphones',
      brand: 'Sony', category: 'Audio',
      price: 7999, original_price: 12990, discount: 38, rating: 4.4, review_count: 18200,
      seller: 'Cloudtail India', delivery_info: '1-2 Days (Prime)',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=sony+wh-ch720n',
      availability: 'In Stock',
    },
    {
      name: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
      brand: 'boAt', category: 'Audio',
      price: 1099, original_price: 2990, discount: 63, rating: 4.1, review_count: 85000,
      seller: 'Appario Retail', delivery_info: '2-3 Days (Prime)',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=boat+rockerz+450',
      availability: 'In Stock',
    },
    {
      name: 'JBL Tune 670NC Wireless Headphones',
      brand: 'JBL', category: 'Audio',
      price: 5999, original_price: 9999, discount: 40, rating: 4.3, review_count: 9400,
      seller: 'Harman India', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=jbl+tune+670nc',
      availability: 'In Stock',
    },
  ],
  'earbud': [
    {
      name: 'Apple AirPods Pro (2nd Gen) with USB-C',
      brand: 'Apple', category: 'Audio',
      price: 19900, original_price: 24900, discount: 20, rating: 4.7, review_count: 32000,
      seller: 'Appario Retail', delivery_info: '1-2 Days (Prime)',
      image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=airpods+pro+2',
      availability: 'In Stock',
    },
    {
      name: 'Samsung Galaxy Buds3 Pro TWS Earbuds',
      brand: 'Samsung', category: 'Audio',
      price: 14999, original_price: 19999, discount: 25, rating: 4.4, review_count: 7200,
      seller: 'Samsung India Electronics', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=samsung+galaxy+buds3+pro',
      availability: 'In Stock',
    },
  ],
  'phone': [
    {
      name: 'Samsung Galaxy S24 (5G) 256GB',
      brand: 'Samsung', category: 'Smartphones',
      price: 54999, original_price: 74999, discount: 27, rating: 4.5, review_count: 14200,
      seller: 'Samsung India Electronics', delivery_info: '2-3 Days (Prime)',
      image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=samsung+galaxy+s24',
      availability: 'In Stock',
    },
    {
      name: 'Redmi Note 13 Pro+ 5G (256GB, 12GB RAM)',
      brand: 'Redmi', category: 'Smartphones',
      price: 29999, original_price: 35999, discount: 17, rating: 4.3, review_count: 22100,
      seller: 'Cloudtail India', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1512499617640-c2f999108c72?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=redmi+note+13+pro+plus',
      availability: 'In Stock',
    },
  ],
  'laptop': [
    {
      name: 'ASUS VivoBook 15 (Intel Core i5-13th Gen, 16GB RAM, 512GB SSD)',
      brand: 'ASUS', category: 'Computers',
      price: 52990, original_price: 74990, discount: 29, rating: 4.3, review_count: 8800,
      seller: 'Appario Retail', delivery_info: '3-5 Days',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=asus+vivobook+15+i5',
      availability: 'In Stock',
    },
    {
      name: 'Lenovo IdeaPad Slim 3 (Ryzen 5 7520U, 8GB, 512GB SSD)',
      brand: 'Lenovo', category: 'Computers',
      price: 38990, original_price: 55000, discount: 29, rating: 4.2, review_count: 6300,
      seller: 'Lenovo India', delivery_info: '3-5 Days',
      image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=lenovo+ideapad+slim+3+ryzen+5',
      availability: 'In Stock',
    },
  ],
  'watch': [
    {
      name: 'Noise ColorFit Ultra 3 Smartwatch (46mm AMOLED)',
      brand: 'Noise', category: 'Wearables',
      price: 2999, original_price: 7999, discount: 63, rating: 4.1, review_count: 41000,
      seller: 'Gonoise', delivery_info: '2-3 Days',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=noise+colorfit+ultra+3',
      availability: 'In Stock',
    },
    {
      name: 'Apple Watch Series 9 GPS 45mm',
      brand: 'Apple', category: 'Wearables',
      price: 44900, original_price: 49900, discount: 10, rating: 4.8, review_count: 11200,
      seller: 'Appario Retail', delivery_info: '1-2 Days (Prime)',
      image_url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=apple+watch+series+9+gps+45mm',
      availability: 'In Stock',
    },
  ],
  'default': [
    {
      name: 'boAt Airdopes 141 TWS Earbuds',
      brand: 'boAt', category: 'Audio',
      price: 999, original_price: 2990, discount: 67, rating: 4.1, review_count: 120000,
      seller: 'Appario Retail', delivery_info: '2-3 Days (Prime)',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=boat+airdopes+141',
      availability: 'In Stock',
    },
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony', category: 'Audio',
      price: 26990, original_price: 34990, discount: 23, rating: 4.7, review_count: 31000,
      seller: 'Cloudtail India', delivery_info: '1-2 Days (Prime)',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
      product_url: 'https://www.amazon.in/s?k=sony+wh1000xm5',
      availability: 'In Stock',
    },
  ],
};

class AmazonProvider extends BaseProvider {
  constructor() {
    super('Amazon');
    this.apiKey = process.env.AMAZON_API_KEY || null;
  }

  /**
   * Search Amazon for products.
   * Uses PAAPI 5 if AMAZON_API_KEY is set, else returns mock data.
   */
  async searchProducts(query) {
    if (this.apiKey) {
      // TODO: Replace with real PAAPI 5 call
      // const paapi5 = require('paapi5-nodejs-sdk');
      // ...
      console.log('[Amazon] Real API key detected (PAAPI 5 integration TODO).');
    }
    return this._mockSearch(query);
  }

  async getProductDetails(productId) {
    const all = Object.values(MOCK_CATALOG).flat();
    const match = all.find(p => p.product_url.includes(productId));
    return match ? this.normalize({ ...match, platform: 'Amazon' }) : null;
  }

  _mockSearch(query) {
    let products = [];
    try {
      const results = searchMockCatalog(query);
      for (const p of results) {
        const listing = (p.listings || []).find(l => (l.marketplace || '').toLowerCase() === 'amazon');
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
            seller: 'Amazon',
            delivery_info: '2-3 Days',
            image_url: p.imageUrl,
            product_url: listing.productUrl || 'https://www.amazon.in',
            availability: 'In Stock',
            priceStatus: 'DEMO_PRICE'
          });
        }
      }
    } catch (err) {
      console.warn('[AmazonProvider] catalog search warning:', err.message);
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

    return unique.map(p => this.normalize({ ...p, platform: 'Amazon' }));
  }
}

export default new AmazonProvider();
