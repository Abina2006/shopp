/**
 * Base Provider Interface for ShopWise AI product providers.
 * Every platform provider (Amazon, Flipkart, Meesho, Blinkit, Instamart, Zepto, BigBasket, JioMart) extends this class.
 */
export class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  async searchProducts(query) {
    throw new Error(`${this.name}.searchProducts() is not implemented.`);
  }

  async getProductDetails(productId) {
    throw new Error(`${this.name}.getProductDetails() is not implemented.`);
  }

  normalize(raw) {
    const price = parseFloat(raw.price) || 0;
    const originalPrice = parseFloat(raw.original_price || raw.originalPrice) || price;
    const discount = originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : (parseFloat(raw.discount || raw.discount_percentage || raw.discountPercentage) || 0);

    return {
      name: (raw.name || '').trim(),
      platform: raw.platform || this.name,
      price,
      original_price: originalPrice,
      discount,
      discount_percentage: discount,
      currency: raw.currency || 'INR',
      rating: parseFloat(raw.rating) || 4.5,
      review_count: parseInt(raw.review_count || raw.reviewCount, 10) || 120,
      seller: raw.seller || raw.sellerName || this.name,
      delivery_info: raw.delivery_info || raw.deliveryTime || '2-3 Days',
      image_url: raw.image_url || raw.imageUrl || '',
      product_url: raw.product_url || raw.productUrl || `https://www.${this.name.toLowerCase().replace(/\s+/g, '')}.com/s?q=${encodeURIComponent(raw.name || '')}`,
      availability: raw.availability || 'IN_STOCK',
      in_stock: true,
      source: this.name,
      brand: raw.brand || (raw.name ? raw.name.split(' ')[0] : 'Brand'),
      category: raw.category || 'General',
      description: raw.description || `${raw.name || 'Product'} available on ${this.name}.`,
      priceStatus: raw.priceStatus || 'DEMO_PRICE'
    };
  }
}

export default BaseProvider;
