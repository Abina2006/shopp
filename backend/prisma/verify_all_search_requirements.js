import { PrismaClient } from '@prisma/client';
import { getAllProducts, getProductById } from '../src/modules/product/product.service.js';

const prisma = new PrismaClient();

const GROCERY_ALLOWED = ['blinkit', 'swiggy instamart', 'zepto', 'bigbasket', 'jiomart'];
const ELECTRONICS_ALLOWED = ['amazon', 'flipkart', 'meesho'];
const BANNED_PLATFORMS = ['croma', 'myntra'];

async function runComprehensiveAudit() {
  console.log('==================================================');
  console.log('SHOPWISE AI — COMPREHENSIVE SEARCH & CATALOG AUDIT');
  console.log('==================================================\n');

  let overallPass = true;
  const testResults = {};

  // 1. DATABASE AUDIT
  console.log('--- 1. DATABASE COMPLIANCE CHECK ---');
  const allProducts = await prisma.product.findMany({ include: { listings: true } });
  const allListings = await prisma.productListing.findMany({});

  const groceryProducts = allProducts.filter(p => p.categoryType === 'GROCERY');
  const electronicsProducts = allProducts.filter(p => p.categoryType === 'ELECTRONICS');

  const cromaListings = allListings.filter(l => (l.sellerName || '').toLowerCase().includes('croma'));
  const myntraListings = allListings.filter(l => (l.sellerName || '').toLowerCase().includes('myntra'));

  console.log(`Total Products: ${allProducts.length}`);
  console.log(`Total Listings: ${allListings.length}`);
  console.log(`Grocery Products: ${groceryProducts.length}`);
  console.log(`Electronics Products: ${electronicsProducts.length}`);
  console.log(`Croma Listings in DB: ${cromaListings.length}`);
  console.log(`Myntra Listings in DB: ${myntraListings.length}`);

  const dbPass = cromaListings.length === 0 && myntraListings.length === 0 && allProducts.length > 0;
  console.log(`DATABASE AUDIT: ${dbPass ? 'PASS ✅' : 'FAIL ❌'}\n`);

  // 2. SEARCH TESTS
  console.log('--- 2. SEARCH & MARKETPLACE MAPPING TESTS ---');

  const searchTests = [
    { query: 'Kurkure', expectedCatType: 'GROCERY', expectedCat: 'Snacks', allowed: GROCERY_ALLOWED },
    { query: 'Milk', expectedCatType: 'GROCERY', expectedCat: 'Dairy', allowed: GROCERY_ALLOWED },
    { query: 'Curd', expectedCatType: 'GROCERY', expectedCat: 'Dairy', allowed: GROCERY_ALLOWED },
    { query: 'iPhone 15', expectedCatType: 'ELECTRONICS', expectedCat: 'Mobile', allowed: ELECTRONICS_ALLOWED },
    { query: 'Laptop', expectedCatType: 'ELECTRONICS', expectedCat: 'Laptop', allowed: ELECTRONICS_ALLOWED },
    { query: 'Sony Headphones', expectedCatType: 'ELECTRONICS', expectedCat: 'Audio', allowed: ELECTRONICS_ALLOWED },
    { query: 'Dove Shampoo', expectedCatType: 'GROCERY', expectedCat: 'Personal Care', allowed: GROCERY_ALLOWED },
  ];

  for (const test of searchTests) {
    console.log(`Testing Query: "${test.query}"...`);
    const results = await getAllProducts({ search: test.query });

    if (results.length === 0) {
      console.log(`❌ FAIL: No products returned for "${test.query}"`);
      testResults[test.query] = 'FAIL (No results)';
      overallPass = false;
      continue;
    }

    const primaryProduct = results[0];
    const listings = primaryProduct.listings || [];
    const actualPlatforms = listings.map(l => (l.sellerName || '').toLowerCase());

    console.log(`  Matched Title: "${primaryProduct.name}"`);
    console.log(`  Category: ${primaryProduct.categoryType} → ${primaryProduct.category}`);
    console.log(`  Platforms (${listings.length}): [${listings.map(l => l.sellerName).join(', ')}]`);

    // Check category type
    const categoryPass = primaryProduct.categoryType === test.expectedCatType;

    // Check allowed platforms
    const platformsValid = actualPlatforms.every(p => test.allowed.includes(p));
    const noDisallowed = !actualPlatforms.some(p => BANNED_PLATFORMS.includes(p));
    const pass = categoryPass && platformsValid && noDisallowed && listings.length > 0;

    if (pass) {
      console.log(`  Result: PASS ✅\n`);
      testResults[test.query] = 'PASS';
    } else {
      console.log(`  Result: FAIL ❌ (Category: ${categoryPass}, Platforms: ${platformsValid})\n`);
      testResults[test.query] = 'FAIL';
      overallPass = false;
    }
  }

  // Summary Report
  console.log('==================================================');
  console.log('FINAL AUDIT SUMMARY REPORT');
  console.log('==================================================');
  console.log(`DATABASE: ${dbPass ? 'PASS' : 'FAIL'}`);
  console.log(`CATALOG: ${allProducts.length} products`);
  console.log(`LISTINGS: ${allListings.length} listings`);
  console.log(`GROCERY PRODUCTS: ${groceryProducts.length}`);
  console.log(`ELECTRONICS PRODUCTS: ${electronicsProducts.length}`);
  console.log(`CROMA REFERENCES: ${cromaListings.length}`);
  console.log(`MYNTRA REFERENCES: ${myntraListings.length}`);
  console.log('\nSEARCH TESTS:');
  Object.entries(testResults).forEach(([q, res]) => {
    console.log(`  ${q}: ${res}`);
  });
  console.log(`\nOVERALL ACCURACY STATUS: ${overallPass ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
  console.log('==================================================');
}

runComprehensiveAudit()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
