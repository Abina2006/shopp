/**
 * Product Aggregator for ShopWise AI.
 *
 * Orchestrates product search across all configured providers:
 *  1. Calls all providers in parallel (Promise.allSettled)
 *  2. Normalizes results
 *  3. Deduplicates across platforms using name + brand matching
 *  4. Groups listings of the same product across platforms
 *  5. Saves/updates results to PostgreSQL via Prisma
 *  6. Records price history for every listing
 *  7. Returns combined results + per-provider status
 */

import amazonProvider from './amazon.provider.js';
import flipkartProvider from './flipkart.provider.js';
import meeshoProvider from './meesho.provider.js';
import blinkitProvider from './blinkit.provider.js';
import instamartProvider from './instamart.provider.js';
import zeptoProvider from './zepto.provider.js';
import bigbasketProvider from './bigbasket.provider.js';
import jiomartProvider from './jiomart.provider.js';
import prisma from '../config/db.js';

// All registered providers
const PROVIDERS = [
  amazonProvider,
  flipkartProvider,
  meeshoProvider,
  blinkitProvider,
  instamartProvider,
  zeptoProvider,
  bigbasketProvider,
  jiomartProvider,
];

/**
 * Normalize a product name for duplicate detection.
 * Removes punctuation, extra spaces, and lowercases.
 */
function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract model tokens (model numbers, key identifiers) from a product name.
 * e.g. "Sony WH-CH720N" → ["sony", "wh", "ch720n"]
 */
function extractTokens(name) {
  return normalizeName(name)
    .split(' ')
    .filter(t => t.length > 1);
}

/**
 * Calculate similarity score between two product names.
 * Returns 0–1 (1 = exact match).
 */
function nameSimilarity(a, b) {
  const tokensA = new Set(extractTokens(a));
  const tokensB = new Set(extractTokens(b));
  const intersection = [...tokensA].filter(t => tokensB.has(t)).length;
  const union = new Set([...tokensA, ...tokensB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Group provider results into "product groups" — where the same product
 * appears on multiple platforms with different prices.
 *
 * Threshold: if two products have ≥ 65% token overlap AND same brand,
 * they are considered the same product.
 */
function groupProducts(allProducts) {
  const THRESHOLD = 0.65;
  const groups = []; // [{canonical, listings:[]}]

  for (const product of allProducts) {
    let matched = false;

    for (const group of groups) {
      const sim = nameSimilarity(group.canonical.name, product.name);
      const sameBrand = group.canonical.brand.toLowerCase() === product.brand.toLowerCase();

      if (sim >= THRESHOLD && sameBrand) {
        group.listings.push(product);
        matched = true;
        break;
      }
    }

    if (!matched) {
      groups.push({ canonical: product, listings: [product] });
    }
  }

  return groups;
}

/**
 * Save a normalized product + all its platform listings to PostgreSQL.
 * Also records price history for each listing.
 */
async function saveToDatabase(group) {
  const canonical = group.canonical;

  // Find or create the base product
  let product = await prisma.product.findFirst({
    where: { name: { contains: canonical.name.split(' ').slice(0, 4).join(' '), mode: 'insensitive' } },
  });

  if (!product) {
    product = await prisma.product.create({
      data: {
        name: canonical.name,
        category: canonical.category || 'General',
        brand: canonical.brand || 'Unknown',
        imageUrl: canonical.image_url || null,
        description: canonical.description || null,
      },
    });
  }

  const savedListings = [];

  for (const listing of group.listings) {
    if (!listing.price || listing.price <= 0) continue;

    // Upsert listing (product × platform)
    let existingListing = await prisma.productListing.findFirst({
      where: { productId: product.id, sellerName: listing.platform },
    });

    const listingData = {
      price: listing.price,
      currency: listing.currency || 'INR',
      rating: listing.rating || null,
      reviewCount: listing.review_count || 0,
      deliveryTime: listing.delivery_info || '3-5 Days',
      sellerUrl: listing.product_url || '',
      lastScrapedAt: new Date(),
    };

    if (!existingListing) {
      existingListing = await prisma.productListing.create({
        data: {
          productId: product.id,
          sellerName: listing.platform,
          ...listingData,
        },
      });
    } else {
      existingListing = await prisma.productListing.update({
        where: { id: existingListing.id },
        data: listingData,
      });
    }

    // Always record price history
    await prisma.priceHistory.create({
      data: {
        listingId: existingListing.id,
        price: listing.price,
        recordedAt: new Date(),
      },
    }).catch(() => {});

    savedListings.push(existingListing);
  }

  return { product, listings: savedListings };
}

/**
 * Main aggregator search function.
 * @param {string} query - Search term
 * @returns {{ products, groups, sources, savedCount }}
 */
export async function aggregateSearch(query) {
  const sources = {};
  const allProducts = [];

  // Fan-out to all providers in parallel
  const results = await Promise.allSettled(
    PROVIDERS.map(provider => provider.searchProducts(query))
  );

  for (let i = 0; i < PROVIDERS.length; i++) {
    const provider = PROVIDERS[i];
    const result = results[i];

    if (result.status === 'fulfilled') {
      sources[provider.name.toLowerCase()] = 'success';
      allProducts.push(...result.value);
    } else {
      sources[provider.name.toLowerCase()] = 'error';
      console.error(`[Aggregator] ${provider.name} failed:`, result.reason?.message);
    }
  }

  // Group duplicates
  const groups = groupProducts(allProducts);

  // Save to DB (best effort — don't fail the search if DB is down)
  let savedCount = 0;
  const dbGroups = [];

  // Patterns that identify auto-generated fallback products — never persist these
  const JUNK_PATTERNS = [
    '- Amazon Choice', '- Best Seller', '- F-Assured',
    '- Value Pack', '- Budget Pick', '- Standard',
    'Arbitraryitem', 'arbitraryitem',
  ];
  const isJunk = (name) => JUNK_PATTERNS.some(p => name.includes(p));

  for (const group of groups) {
    try {
      // Skip saving generic auto-generated fallback products to keep the DB clean
      if (isJunk(group.canonical.name)) {
        dbGroups.push({ ...group, dbProduct: null, dbListings: [] });
        continue;
      }
      const saved = await saveToDatabase(group);
      dbGroups.push({ ...group, dbProduct: saved.product, dbListings: saved.listings });
      savedCount++;
    } catch (err) {
      console.warn(`[Aggregator] DB save failed for "${group.canonical.name}":`, err.message);
      dbGroups.push({ ...group, dbProduct: null, dbListings: [] });
    }
  }

  return {
    products: allProducts,
    groups: dbGroups,
    sources,
    savedCount,
  };
}
