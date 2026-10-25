import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Categories or keywords where Meesho does NOT sell genuine products
const INVALID_MEESHO_KEYWORDS = [
  'macbook',
  'laptop',
  'ipad',
  'iphone',
  'playstation',
  'xbox',
  'rtx',
  'intel core',
  'ryzen',
  'oled tv',
  'sony bravia',
  'samsung galaxy s24',
  'samsung galaxy s23',
  'dslr',
  'camera lens',
];

async function cleanInvalidMeeshoListings() {
  console.log('🔍 Scanning database for invalid/fake Meesho listings...');

  const meeshoListings = await prisma.productListing.findMany({
    where: {
      sellerName: { equals: 'Meesho', mode: 'insensitive' }
    },
    include: {
      product: true,
      priceHistory: true,
      priceAlerts: true
    }
  });

  console.log(`Found total ${meeshoListings.length} Meesho listings in database.`);

  let removedCount = 0;
  for (const listing of meeshoListings) {
    const prodName = (listing.product?.name || '').toLowerCase();
    const prodCategory = (listing.product?.category || '').toLowerCase();
    const price = Number(listing.price);

    const isHighEndTech = INVALID_MEESHO_KEYWORDS.some(kw => prodName.includes(kw));
    const isLaptopsCategory = prodCategory.includes('laptop') || prodCategory.includes('computer');
    const isUnrealisticPrice = price > 15000; // Meesho does not sell high-ticket goods over ₹15k

    if (isHighEndTech || isLaptopsCategory || isUnrealisticPrice) {
      console.log(`🗑️ Removing invalid Meesho listing from: "${listing.product?.name}" (₹${price.toLocaleString('en-IN')})`);

      // Delete associated price history records first if needed
      await prisma.priceHistory.deleteMany({
        where: { listingId: listing.id }
      });

      // Delete associated price alerts
      await prisma.priceAlert.deleteMany({
        where: { listingId: listing.id }
      });

      // Delete the listing
      await prisma.productListing.delete({
        where: { id: listing.id }
      });

      removedCount++;
    } else {
      console.log(`✅ Keeping legitimate Meesho item: "${listing.product?.name}" (₹${price})`);
    }
  }

  console.log(`\n🎉 Finished! Successfully removed ${removedCount} invalid Meesho listings.`);
  await prisma.$disconnect();
}

cleanInvalidMeeshoListings().catch(err => {
  console.error('Error cleaning Meesho listings:', err);
  process.exit(1);
});
