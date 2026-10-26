import { MOCK_PRODUCTS_DATA, TOTAL_MOCK_PRODUCTS } from '../data/mockProducts.js';

if (MOCK_PRODUCTS_DATA.length !== 250) {
  throw new Error(`[MockSearchEngine] Expected 250 mock products, found ${MOCK_PRODUCTS_DATA.length}`);
}

/**
 * Search the 250 Mock Products Dataset using fuzzy multi-field matching & synonyms.
 */
export function searchMockCatalog(query) {
  if (!query || typeof query !== 'string' || !query.trim() || query.trim().toLowerCase() === 'all') {
    return MOCK_PRODUCTS_DATA;
  }

  const qRaw = query.trim().toLowerCase();
  
  // Search Synonym mapping
  const SYNONYMS = {
    'phone': ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
    'phones': ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
    'mobiles': ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
    'mobile': ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
    'smartphone': ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
    'smartphones': ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
    'cellphone': ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
    'cellphones': ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
    'android': ['mobile', 'mobiles', 'smartphone', 'smartphones'],
    '5g': ['mobile', 'mobiles', '5g'],
    'laptop': ['laptop', 'laptops', 'computer', 'notebook', 'macbook'],
    'laptops': ['laptop', 'laptops', 'computer', 'notebook', 'macbook'],
    'computer': ['laptop', 'laptops', 'computer', 'notebook'],
    'computers': ['laptop', 'laptops', 'computer', 'notebook'],
    'notebook': ['laptop', 'laptops', 'computer', 'notebook'],
    'macbook': ['macbook', 'laptop', 'laptops'],
    'gadget': ['laptop', 'laptops', 'mobile', 'mobiles', 'electronics'],
    'gadgets': ['laptop', 'laptops', 'mobile', 'mobiles', 'electronics'],
    'electronic': ['electronics', 'mobile', 'mobiles', 'laptop', 'laptops'],
    'electronics': ['electronics', 'mobile', 'mobiles', 'laptop', 'laptops'],
    'headphone': ['headphones', 'earphones', 'earbuds', 'airdopes', 'audio', 'boat', 'sony', 'jbl', 'airpods'],
    'headphones': ['headphones', 'earphones', 'earbuds', 'airdopes', 'audio', 'boat', 'sony', 'jbl', 'airpods'],
    'earphone': ['headphones', 'earphones', 'earbuds', 'airdopes', 'audio'],
    'earphones': ['headphones', 'earphones', 'earbuds', 'airdopes', 'audio'],
    'earbuds': ['headphones', 'earphones', 'earbuds', 'airdopes', 'audio'],
    'audio': ['headphones', 'earphones', 'earbuds', 'airdopes', 'audio', 'speaker', 'sound'],
    'watch': ['watch', 'smartwatch', 'wearables'],
    'smartwatch': ['watch', 'smartwatch', 'wearables'],
    'wearable': ['watch', 'smartwatch', 'wearables'],
    'wearables': ['watch', 'smartwatch', 'wearables'],
    'shoes': ['shoes', 'footwear', 'sneakers', 'running', 'clogs', 'crocs', 'nike', 'adidas'],
    'footwear': ['shoes', 'footwear', 'sneakers', 'running', 'clogs', 'crocs', 'nike', 'adidas'],
    'sneakers': ['shoes', 'footwear', 'sneakers', 'running', 'nike', 'adidas'],
    'perfume': ['perfume', 'parfum', 'scent', 'fragrance', 'fogg', 'deodorant'],
    'fragrance': ['perfume', 'parfum', 'scent', 'fragrance', 'fogg', 'deodorant'],
    'sunglasses': ['sunglasses', 'glasses', 'shades', 'aviator', 'ray-ban'],
    'appliances': ['appliances', 'appliance', 'induction', 'cooktop', 'air fryer', 'fryer', 'prestige', 'philips'],
    'appliance': ['appliances', 'appliance', 'induction', 'cooktop', 'air fryer', 'fryer', 'prestige', 'philips'],
    'powerbank': ['power bank', 'portronics', 'battery'],
    'power bank': ['power bank', 'portronics', 'battery'],
    'chips': ['chips', 'chip', 'crisp', 'crisps', 'wafer'],
    'snack': ['chips', 'snack', 'snacks', 'namkeen', 'biscuits'],
    'snacks': ['chips', 'snack', 'snacks', 'namkeen', 'biscuits'],
    'juice': ['juice', 'juices', 'beverage', 'drink'],
    'drink': ['juice', 'beverage', 'drink', 'soft drink'],
    'milk': ['milk', 'toned milk', 'full cream milk'],
    'curd': ['curd', 'dahi', 'yogurt'],
    'paneer': ['paneer', 'cottage cheese'],
    'butter': ['butter', 'ghee'],
    'pen': ['pen', 'pens', 'ball pen', 'gel pen'],
    'pens': ['pen', 'pens', 'ball pen', 'gel pen'],
    'dress': ['dress', 'dresses', 'kurti', 'anarkali', 'gown', 'sundress', 'clothing', 'fashion'],
    'dresses': ['dress', 'dresses', 'kurti', 'anarkali', 'gown', 'sundress', 'clothing', 'fashion'],
    'fashion': ['dress', 'dresses', 'kurti', 'fashion', 'clothing', 'jeans', 'hoodie', 'shirt'],
    'grocery': ['grocery', 'groceries', 'rice', 'oil', 'tea', 'sugar', 'atta', 'dal', 'spices'],
    'groceries': ['grocery', 'groceries', 'rice', 'oil', 'tea', 'sugar', 'atta', 'dal', 'spices'],
    'soap': ['soap', 'bathing', 'pears', 'dove', 'dettol', 'santoor', 'medimix', 'shampoo'],
    'banana': ['banana', 'bananas'],
    'egg': ['egg', 'eggs'],
    'eggs': ['egg', 'eggs'],
  };

  const rawTokens = qRaw.split(/\s+/).filter(w => w.length > 1);
  if (rawTokens.length === 0) return [];

  // Expand search tokens with synonyms
  const expandedTokens = new Set(rawTokens);
  rawTokens.forEach(t => {
    if (SYNONYMS[t]) {
      SYNONYMS[t].forEach(s => expandedTokens.add(s));
    }
  });
  const allTokens = Array.from(expandedTokens);

  // Direct word match check using all expanded tokens
  const exactMatches = MOCK_PRODUCTS_DATA.filter(prod => {
    const nameLower = prod.name.toLowerCase();
    const brandLower = prod.brand.toLowerCase();
    const subcatLower = (prod.subcategory || '').toLowerCase();
    const catLower = (prod.category || '').toLowerCase();

    // Check if tokens match whole words, subcategory or category
    return allTokens.some(token => 
      subcatLower === token ||
      subcatLower.includes(token) ||
      nameLower.split(/\s+/).some(w => w === token || w.startsWith(token)) ||
      brandLower === token ||
      catLower.includes(token)
    );
  });

  if (exactMatches.length > 0) {
    // Sort exact matches: items where name or subcategory starts with the query come first
    return exactMatches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const firstToken = rawTokens[0];
      const aStarts = aName.startsWith(firstToken) || (a.subcategory || '').toLowerCase() === firstToken;
      const bStarts = bName.startsWith(firstToken) || (b.subcategory || '').toLowerCase() === firstToken;
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }

  // Fallback search across all text attributes
  return MOCK_PRODUCTS_DATA.filter(prod => {
    const textToMatch = [
      prod.name,
      prod.brand,
      prod.category,
      prod.subcategory,
      prod.variant || '',
      prod.color || '',
      prod.size || '',
      prod.material || '',
      prod.occasion || '',
      prod.demoStatus || ''
    ].join(' ').toLowerCase();

    return allTokens.some(term => textToMatch.includes(term));
  });
}

export default {
  searchMockCatalog,
  TOTAL_MOCK_PRODUCTS
};
