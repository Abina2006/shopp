/**
 * Smart URL Sanitizer & Store Link Generator
 * Ensures all Blinkit, Swiggy Instamart, Zepto, BigBasket, JioMart, Amazon, Flipkart, and Meesho links open cleanly.
 */

export function sanitizeStoreUrl(rawUrl, productName = '', sellerName = '') {
  if (!rawUrl && !productName) return '#';

  // If already a direct clean product page link
  if (rawUrl && (rawUrl.includes('/p/itm') || rawUrl.includes('/dp/') || rawUrl.includes('/gp/') || rawUrl.includes('blinkit.com/s/') || rawUrl.includes('swiggy.com/instamart'))) {
    return rawUrl;
  }

  // Determine seller name
  const seller = (
    sellerName ||
    (rawUrl && rawUrl.includes('blinkit') ? 'Blinkit' :
     rawUrl && rawUrl.includes('swiggy') ? 'Swiggy Instamart' :
     rawUrl && rawUrl.includes('zepto') ? 'Zepto' :
     rawUrl && rawUrl.includes('bigbasket') ? 'BigBasket' :
     rawUrl && rawUrl.includes('jiomart') ? 'JioMart' :
     rawUrl && rawUrl.includes('flipkart') ? 'Flipkart' :
     rawUrl && rawUrl.includes('amazon') ? 'Amazon' :
     rawUrl && rawUrl.includes('meesho') ? 'Meesho' : '')
  ).toLowerCase();

  // Extract clean keyword query
  let query = productName;
  if (!query && rawUrl) {
    try {
      const urlObj = new URL(rawUrl);
      query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || urlObj.searchParams.get('k') || '';
    } catch {
      query = rawUrl;
    }
  }

  // Clean keywords
  const cleanKeywords = (query || '')
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/Pack of \d+ x \d+g/gi, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 5)
    .join(' ');

  const encodedQuery = encodeURIComponent(cleanKeywords);
  const isTechOrBranded = /(sony|apple|iphone|macbook|ipad|samsung|hp|dell|asus|lenovo|ps5|bravia|philips|air\s*fryer|headphones|laptop|tv)/i.test(query);

  if (seller.includes('blinkit')) {
    return `https://blinkit.com/s/?q=${encodedQuery}`;
  }
  if (seller.includes('instamart') || seller.includes('swiggy')) {
    return `https://www.swiggy.com/instamart/search?query=${encodedQuery}`;
  }
  if (seller.includes('zepto')) {
    return `https://zepto.co.in/search?q=${encodedQuery}`;
  }
  if (seller.includes('bigbasket')) {
    return `https://www.bigbasket.com/ps/?q=${encodedQuery}`;
  }
  if (seller.includes('jiomart')) {
    return `https://www.jiomart.com/search/${encodedQuery}`;
  }
  if (seller.includes('flipkart')) {
    return `https://www.flipkart.com/search?q=${encodedQuery}`;
  }
  if (seller.includes('amazon')) {
    return `https://www.amazon.in/s?k=${encodedQuery}`;
  }
  if (seller.includes('meesho')) {
    if (isTechOrBranded) {
      return `https://www.amazon.in/s?k=${encodedQuery}`;
    }
    return `https://www.meesho.com/search?q=${encodedQuery}`;
  }

  return rawUrl || `https://www.amazon.in/s?k=${encodedQuery}`;
}
