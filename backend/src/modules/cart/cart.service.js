import prisma from '../../config/db.js';

/**
 * Get cart items for a user
 */
export async function getCartItems(userId) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      listing: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveValidListingId(rawListingId) {
  if (!rawListingId) throw new Error('Listing ID is required');

  // 1. If rawListingId is already a valid UUID, check if it exists in ProductListing
  if (UUID_REGEX.test(rawListingId)) {
    const existing = await prisma.productListing.findUnique({
      where: { id: rawListingId },
    });
    if (existing) return existing.id;
  }

  // 2. If it's a non-UUID string or not in DB (e.g. list-prod-snackbev-001-blinkit or list_1_bigbasket)
  const { MOCK_PRODUCTS_DATA } = await import('../../data/mockProducts.js');
  let matchedProduct = null;
  let matchedListing = null;

  for (const p of MOCK_PRODUCTS_DATA) {
    if (Array.isArray(p.listings)) {
      const l = p.listings.find(
        (item) => item.listingId === rawListingId || item.id === rawListingId
      );
      if (l) {
        matchedProduct = p;
        matchedListing = l;
        break;
      }
    }
  }

  if (!matchedProduct) {
    for (const p of MOCK_PRODUCTS_DATA) {
      if (rawListingId.includes(p.id) || rawListingId.includes(p.productId)) {
        matchedProduct = p;
        matchedListing = p.listings?.[0] || null;
        break;
      }
    }
  }

  if (!matchedProduct) {
    matchedProduct = MOCK_PRODUCTS_DATA[0];
    matchedListing = matchedProduct?.listings?.[0] || null;
  }

  // 3. Ensure the Product exists in DB
  let dbProduct = await prisma.product.findFirst({
    where: { name: matchedProduct.name },
  });

  if (!dbProduct) {
    dbProduct = await prisma.product.create({
      data: {
        name: matchedProduct.name,
        category: matchedProduct.category || 'General',
        brand: matchedProduct.brand || 'Generic',
        imageUrl: matchedProduct.imageUrl || null,
        description: matchedProduct.description || null,
      },
    });
  }

  // 4. Ensure the ProductListing exists in DB with a valid UUID
  const seller = matchedListing?.sellerName || matchedListing?.marketplace || 'Marketplace';
  const price = parseFloat(matchedListing?.price) || 99.0;
  const sellerUrl = matchedListing?.buyUrl || matchedListing?.productUrl || '';

  let dbListing = await prisma.productListing.findFirst({
    where: {
      productId: dbProduct.id,
      sellerName: seller,
    },
  });

  if (!dbListing) {
    dbListing = await prisma.productListing.create({
      data: {
        productId: dbProduct.id,
        sellerName: seller,
        sellerUrl: sellerUrl,
        price: price,
        currency: 'INR',
        rating: parseFloat(matchedListing?.rating) || 4.5,
        reviewCount: parseInt(matchedListing?.reviewCount || matchedListing?.ratingCount, 10) || 50,
        lastScrapedAt: new Date(),
      },
    });
  }

  return dbListing.id;
}

/**
 * Add or update a cart item
 */
export async function addCartItem(userId, rawListingId, quantity = 1, unit = null) {
  const listingId = await resolveValidListingId(rawListingId);
  const cleanUnit = unit || undefined;
  return prisma.cartItem.upsert({
    where: {
      userId_listingId: { userId, listingId },
    },
    update: { quantity, unit: cleanUnit },
    create: { userId, listingId, quantity, unit: cleanUnit },
    include: {
      listing: {
        include: { product: true },
      },
    },
  });
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(userId, itemId, quantity, unit) {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, userId },
  });
  if (!item) return null;

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity, ...(unit ? { unit } : {}) },
    include: {
      listing: {
        include: { product: true },
      },
    },
  });
}

/**
 * Remove a cart item
 */
export async function removeCartItem(userId, itemId) {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, userId },
  });
  if (!item) return null;

  return prisma.cartItem.delete({ where: { id: itemId } });
}

/**
 * Clear all cart items for a user
 */
export async function clearCart(userId) {
  return prisma.cartItem.deleteMany({ where: { userId } });
}
