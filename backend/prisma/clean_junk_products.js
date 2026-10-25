import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Patterns that identify auto-generated garbage mock products
const JUNK_PATTERNS = [
  '- Amazon Choice',
  '- Best Seller',
  '- F-Assured',
  '- Value Pack',
  '- Budget Pick',
  '- Standard',
  'Arbitraryitem',
  'arbitraryitem',
  'Premium Soap',
  '- Soap ',
  'Soap - ',
];

async function cleanJunkProducts() {
  console.log('🧹 Cleaning junk mock products from database...');

  const allProducts = await prisma.product.findMany();
  let deleted = 0;

  for (const product of allProducts) {
    const isJunk = JUNK_PATTERNS.some(p => product.name.includes(p));
    if (isJunk) {
      console.log(`🗑️  Deleting: ${product.name}`);
      await prisma.product.delete({ where: { id: product.id } });
      deleted++;
    }
  }

  console.log(`\n✅ Done! Deleted ${deleted} junk products.`);
}

cleanJunkProducts()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
