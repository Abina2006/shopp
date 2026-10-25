import { MOCK_PRODUCTS_DATA, TOTAL_MOCK_PRODUCTS } from './src/data/mockProducts.js';
import { getProductById, getAllProducts } from './src/modules/product/product.service.js';

async function runAudit() {
  console.log('=== STARTING 250 PRODUCT & MARKETPLACE URL AUDIT ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Check total count
  assert(MOCK_PRODUCTS_DATA.length === 250, `Exactly 250 products in dataset (found ${MOCK_PRODUCTS_DATA.length})`);
  assert(TOTAL_MOCK_PRODUCTS === 250, `TOTAL_MOCK_PRODUCTS is 250`);

  // 2. Audit all 250 products
  let missingImages = 0;
  let missingAlts = 0;
  let genericHomepages = 0;
  let invalidListings = 0;

  const genericUrls = [
    'https://www.swiggy.com/instamart',
    'https://www.blinkit.com',
    'https://blinkit.com',
    'https://www.zeptonow.com',
    'https://www.bigbasket.com',
    'https://www.jiomart.com',
    'https://www.amazon.in',
    'https://www.flipkart.com',
    'https://www.meesho.com'
  ];

  for (const p of MOCK_PRODUCTS_DATA) {
    if (!p.imageUrl || !p.imageUrl.startsWith('http')) missingImages++;
    if (!p.imageAlt) missingAlts++;
    
    if (!p.listings || p.listings.length === 0) {
      invalidListings++;
    } else {
      for (const l of p.listings) {
        if (!l.buyUrl || !l.urlType) invalidListings++;
        if (genericUrls.includes(l.buyUrl) || l.buyUrl.endsWith('/instamart') || l.buyUrl.endsWith('.com')) {
          genericHomepages++;
        }
      }
    }
  }

  assert(missingImages === 0, `All 250 products have valid image URLs (missing: ${missingImages})`);
  assert(missingAlts === 0, `All 250 products have imageAlt properties (missing: ${missingAlts})`);
  assert(invalidListings === 0, `All listings have buyUrl and urlType (invalid: ${invalidListings})`);
  assert(genericHomepages === 0, `Zero generic marketplace homepage URLs (found: ${genericHomepages})`);

  // 3. Test the 10 specific target products from the prompt
  const targetQueries = [
    "Amul Taaza Toned Milk",
    "Kurkure Masala Munch",
    "Lay's Classic Salted Chips",
    "Fortune Sunlite Refined Sunflower Oil",
    "Banana",
    "Coca-Cola",
    "iPhone 15",
    "Samsung Galaxy S24",
    "Acer Nitro V 15",
    "Cello Butterflow Ball Pen"
  ];

  console.log('\n=== TESTING 10 SPECIFIC TARGET PRODUCTS ===\n');

  for (const query of targetQueries) {
    const product = MOCK_PRODUCTS_DATA.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
    assert(Boolean(product), `Product found: "${query}" -> ID: ${product?.id}, Name: "${product?.name}"`);

    if (product) {
      assert(Boolean(product.imageUrl), `Image present for ${product.name}: ${product.imageUrl.substring(0, 50)}...`);
      assert(product.listings.length >= 3, `Has ${product.listings.length} marketplace listings`);
      
      const firstListing = product.listings[0];
      assert(firstListing.buyUrl.includes('query=') || firstListing.buyUrl.includes('?q=') || firstListing.buyUrl.includes('?k=') || firstListing.buyUrl.includes('/search/'), 
        `Listing direct search destination verified for ${firstListing.marketplace}: ${firstListing.buyUrl}`);
      assert(firstListing.urlType === 'search' || firstListing.urlType === 'product', `Listing urlType: "${firstListing.urlType}"`);
    }
  }

  // 4. Test Service Layer getProductById
  console.log('\n=== TESTING SERVICE LAYER (getProductById & getAllProducts) ===\n');
  const serviceProduct = await getProductById('prod-snackbev-002'); // Kurkure
  assert(Boolean(serviceProduct), `Service getProductById('prod-snackbev-002') returned product`);
  assert(serviceProduct?.name === 'Kurkure Masala Munch', `Name is "${serviceProduct?.name}"`);
  assert(Boolean(serviceProduct?.imageAlt), `imageAlt present: "${serviceProduct?.imageAlt}"`);
  const instamartListing = serviceProduct?.listings?.find(l => l.sellerName === 'Swiggy Instamart');
  assert(instamartListing?.buyUrl.includes('swiggy.com/instamart/search?query='), `Instamart search query present in service output: ${instamartListing?.buyUrl}`);


  console.log(`\n========================================`);
  console.log(`TOTAL AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
