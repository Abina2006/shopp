import http from 'http';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('====================================');
  console.log('RUNNING SHOPWISE AI AUTOMATED SUITE');
  console.log('====================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, desc) {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
      failed++;
    }
  }

  try {
    // 1. All Products count
    const allRes = await fetchJson('http://localhost:5000/api/products');
    const allProducts = allRes.data || [];
    assert(allProducts.length === 250, `All Products count is 250 (actual: ${allProducts.length})`);

    // 2. Category counts
    const snacks = allProducts.filter(p => p.category === 'Snacks & Beverages');
    const grocery = allProducts.filter(p => p.category === 'Grocery');
    const mobiles = allProducts.filter(p => p.category === 'Electronics' && p.subcategory === 'Mobiles');
    const laptops = allProducts.filter(p => p.category === 'Electronics' && p.subcategory === 'Laptops');
    const departmental = allProducts.filter(p => p.category === 'Departmental');
    const fashion = allProducts.filter(p => p.category === 'Fashion');

    assert(snacks.length === 50, `Snacks & Beverages count is 50 (actual: ${snacks.length})`);
    assert(grocery.length === 50, `Grocery count is 50 (actual: ${grocery.length})`);
    assert(mobiles.length === 25, `Mobiles count is 25 (actual: ${mobiles.length})`);
    assert(laptops.length === 25, `Laptops count is 25 (actual: ${laptops.length})`);
    assert(departmental.length === 50, `Departmental count is 50 (actual: ${departmental.length})`);
    assert(fashion.length === 50, `Fashion count is 50 (actual: ${fashion.length})`);

    // 3. Unique IDs and No Duplicates
    const idSet = new Set(allProducts.map(p => p.id));
    assert(idSet.size === 250, `All 250 product IDs are unique (unique count: ${idSet.size})`);

    // 4. No Banned Synthetic Product Names
    const bannedPrefixes = ['FlexFit', 'AuraTech', 'Signature', 'ApexCore', 'OmniSeries', 'EliteCraft', 'PrimeGlide', 'Vortex', 'ProMax', 'UrbanStyle'];
    const bannedFound = allProducts.filter(p => bannedPrefixes.some(b => p.name.includes(b)));
    assert(bannedFound.length === 0, `No banned synthetic names found in catalog (found: ${bannedFound.length})`);

    // 5. Grocery & Snack Marketplace check
    const groceryQuickCommerce = ['Blinkit', 'Zepto', 'Swiggy Instamart', 'BigBasket', 'JioMart'];
    let allGroceryValidMarketplaces = true;
    for (const p of [...snacks, ...grocery]) {
      for (const l of (p.listings || [])) {
        if (!groceryQuickCommerce.includes(l.sellerName)) {
          allGroceryValidMarketplaces = false;
          console.error(`Invalid marketplace for grocery product ${p.name}: ${l.sellerName}`);
        }
      }
    }
    assert(allGroceryValidMarketplaces, `All grocery and snack listings use only eligible quick-commerce marketplaces`);

    // 6. Search tests
    const kurkureRes = await fetchJson('http://localhost:5000/api/products/smart-search?q=Kurkure');
    const kurkureItems = kurkureRes.data?.products || [];
    assert(kurkureItems.length > 0 && kurkureItems[0].name.toLowerCase().includes('kurkure'), `Search "Kurkure" returns relevant products (found: ${kurkureItems.length})`);

    const milkRes = await fetchJson('http://localhost:5000/api/products/smart-search?q=Milk');
    const milkItems = milkRes.data?.products || [];
    assert(milkItems.length > 0 && milkItems.some(p => p.name.toLowerCase().includes('milk')), `Search "Milk" returns relevant products (found: ${milkItems.length})`);

    const bananaRes = await fetchJson('http://localhost:5000/api/products/smart-search?q=banana');
    const bananaItems = bananaRes.data?.products || [];
    assert(bananaItems.length > 0 && bananaItems.some(p => p.name.toLowerCase().includes('banana')), `Search "banana" returns banana products (found: ${bananaItems.length})`);

    const oilRes = await fetchJson('http://localhost:5000/api/products/smart-search?q=sunflower%20oil');
    const oilItems = oilRes.data?.products || [];
    assert(oilItems.length > 0 && oilItems.some(p => p.name.toLowerCase().includes('fortune')), `Search "sunflower oil" returns Fortune oil (found: ${oilItems.length})`);

    const iphoneRes = await fetchJson('http://localhost:5000/api/products/smart-search?q=iPhone%2015');
    const iphoneItems = iphoneRes.data?.products || [];
    assert(iphoneItems.length > 0 && iphoneItems.some(p => p.name.toLowerCase().includes('iphone 15')), `Search "iPhone 15" returns iPhone 15 (found: ${iphoneItems.length})`);

    const nitroRes = await fetchJson('http://localhost:5000/api/products/smart-search?q=Acer%20Nitro%20V15');
    const nitroItems = nitroRes.data?.products || [];
    assert(nitroItems.length > 0 && nitroItems.some(p => p.name.toLowerCase().includes('acer nitro')), `Search "Acer Nitro V15" returns Acer Nitro (found: ${nitroItems.length})`);

    // 7. Unknown search honest empty state
    const unknownRes = await fetchJson('http://localhost:5000/api/products/smart-search?q=xyznonexistentitem12345');
    const unknownItems = unknownRes.data?.products || [];
    assert(unknownItems.length === 0, `Unknown search returns 0 products without generating fake products (actual: ${unknownItems.length})`);

    // 8. Product Detail API consistency tests
    const fortuneOil = allProducts.find(p => p.name.toLowerCase().includes('fortune sunlite'));
    assert(fortuneOil !== undefined, `Fortune Sunlite Oil exists in catalog`);
    if (fortuneOil) {
      const detailRes = await fetchJson(`http://localhost:5000/api/products/${fortuneOil.id}`);
      const detail = detailRes.data;
      assert(detail && detail.id === fortuneOil.id, `Detail API returns matching product ID`);
      assert(detail.listings && detail.listings.length === 5, `Detail API returns 5 demo marketplace listings (actual: ${detail.listings?.length})`);
      assert(detail.lowestPriceListing && detail.lowestPriceListing.price > 0, `Detail API provides lowest price listing with valid price`);
      assert(detail.savings !== undefined && !isNaN(detail.savings), `Detail API provides valid savings`);
    }

    const amulCurd = allProducts.find(p => p.name.toLowerCase().includes('amul') && (p.name.toLowerCase().includes('dahi') || p.name.toLowerCase().includes('masti')));
    assert(amulCurd !== undefined, `Amul Masti Dahi exists in catalog`);
    if (amulCurd) {
      const detailRes = await fetchJson(`http://localhost:5000/api/products/${amulCurd.id}`);
      const detail = detailRes.data;
      assert(detail && detail.id === amulCurd.id, `Amul Curd detail API returns matching product ID`);
      assert(detail.listings && detail.listings.length === 5, `Amul Curd detail API returns 5 demo marketplace listings (actual: ${detail.listings?.length})`);
      assert(detail.lowestPriceListing && detail.lowestPriceListing.price > 0, `Amul Curd lowest price is valid`);
    }

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n====================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================\n');
}

runTests();
