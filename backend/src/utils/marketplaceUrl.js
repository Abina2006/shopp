/**
 * ShopWise AI — Centralized Marketplace URL Generator
 *
 * Generates direct product search URLs for all 8 supported marketplaces.
 * Prevents generic homepage redirects when user clicks Buy/Search.
 */

export function getMarketplaceBuyUrl(product, marketplace) {
  if (!product) return 'https://www.google.com';
  
  const name = (product.name || '').trim();
  const brand = (product.brand && product.brand !== 'Generic' && product.brand !== 'Unknown' && product.brand !== 'Fresh') 
    ? product.brand.trim() 
    : '';

  // Clean search query containing brand + product name
  let queryTerms = name;
  if (brand && !name.toLowerCase().includes(brand.toLowerCase())) {
    queryTerms = `${brand} ${name}`;
  }

  const query = encodeURIComponent(queryTerms);
  const m = (marketplace || '').toLowerCase().trim();

  switch (m) {
    case 'swiggy instamart':
    case 'instamart':
      return `https://www.swiggy.com/instamart/search?query=${query}`;
    
    case 'blinkit':
      return `https://blinkit.com/s/?q=${query}`;
    
    case 'zepto':
      return `https://www.zeptonow.com/search?q=${query}`;
    
    case 'bigbasket':
      return `https://www.bigbasket.com/ps/?q=${query}`;
    
    case 'jiomart':
      return `https://www.jiomart.com/search/${query}`;
    
    case 'amazon':
      return `https://www.amazon.in/s?k=${query}`;
    
    case 'flipkart':
      return `https://www.flipkart.com/search?q=${query}`;
    
    case 'meesho':
      return `https://www.meesho.com/search?q=${query}`;
    
    default:
      return `https://www.amazon.in/s?k=${query}`;
  }
}

export default getMarketplaceBuyUrl;
