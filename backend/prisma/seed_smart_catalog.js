import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SMART_PRODUCTS = [
  {
    name: 'Country Eggs — 12 Pieces',
    category: 'Eggs & Poultry',
    categoryType: 'GROCERY',
    brand: 'Farm Fresh',
    description: 'Farm fresh country eggs, rich in protein. 12 pieces pack.',
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600',
    imageVerified: true,
    baseQuantity: 12,
    baseUnit: 'pieces',
    subcategory: 'Eggs',
    variant: '12 Pieces Pack',
    listings: [
      { sellerName: 'Blinkit', price: 95.00, originalPrice: 110.00, unitPrice: 7.92, sellerUrl: 'https://blinkit.com', productUrl: 'https://blinkit.com/s/?q=eggs+12', rating: 4.8, reviewCount: 1240, deliveryTime: '10 mins' },
      { sellerName: 'Swiggy Instamart', price: 92.00, originalPrice: 110.00, unitPrice: 7.67, sellerUrl: 'https://swiggy.com/instamart', productUrl: 'https://swiggy.com/instamart/search?q=eggs+12', rating: 4.7, reviewCount: 980, deliveryTime: '12 mins' },
      { sellerName: 'Zepto', price: 89.00, originalPrice: 110.00, unitPrice: 7.42, sellerUrl: 'https://zepto.com', productUrl: 'https://zepto.com/search?q=eggs+12', rating: 4.9, reviewCount: 1560, deliveryTime: '8 mins' },
      { sellerName: 'BigBasket', price: 90.00, originalPrice: 105.00, unitPrice: 7.50, sellerUrl: 'https://bigbasket.com', productUrl: 'https://bigbasket.com/ps/?q=eggs+12', rating: 4.6, reviewCount: 2100, deliveryTime: '2 hours' },
      { sellerName: 'JioMart', price: 88.00, originalPrice: 105.00, unitPrice: 7.33, sellerUrl: 'https://jiomart.com', productUrl: 'https://jiomart.com/search/eggs+12', rating: 4.5, reviewCount: 750, deliveryTime: 'Tomorrow' }
    ]
  },
  {
    name: 'Country Eggs — 6 Pieces',
    category: 'Eggs & Poultry',
    categoryType: 'GROCERY',
    brand: 'Farm Fresh',
    description: 'Farm fresh country eggs, rich in protein. 6 pieces pack.',
    imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600',
    imageVerified: true,
    baseQuantity: 6,
    baseUnit: 'pieces',
    subcategory: 'Eggs',
    variant: '6 Pieces Pack',
    listings: [
      { sellerName: 'Blinkit', price: 52.00, originalPrice: 60.00, unitPrice: 8.67, sellerUrl: 'https://blinkit.com', productUrl: 'https://blinkit.com/s/?q=eggs+6', rating: 4.8, reviewCount: 840, deliveryTime: '10 mins' },
      { sellerName: 'Swiggy Instamart', price: 50.00, originalPrice: 60.00, unitPrice: 8.33, sellerUrl: 'https://swiggy.com/instamart', productUrl: 'https://swiggy.com/instamart/search?q=eggs+6', rating: 4.7, reviewCount: 650, deliveryTime: '12 mins' },
      { sellerName: 'Zepto', price: 48.00, originalPrice: 60.00, unitPrice: 8.00, sellerUrl: 'https://zepto.com', productUrl: 'https://zepto.com/search?q=eggs+6', rating: 4.9, reviewCount: 920, deliveryTime: '8 mins' },
      { sellerName: 'BigBasket', price: 49.00, originalPrice: 58.00, unitPrice: 8.17, sellerUrl: 'https://bigbasket.com', productUrl: 'https://bigbasket.com/ps/?q=eggs+6', rating: 4.6, reviewCount: 1100, deliveryTime: '2 hours' },
      { sellerName: 'JioMart', price: 46.00, originalPrice: 55.00, unitPrice: 7.67, sellerUrl: 'https://jiomart.com', productUrl: 'https://jiomart.com/search/eggs+6', rating: 4.5, reviewCount: 430, deliveryTime: 'Tomorrow' }
    ]
  },
  {
    name: 'Monster Energy Drink Original Green 500ml',
    category: 'Beverages',
    categoryType: 'GROCERY',
    brand: 'Monster',
    description: 'Tear into a can of Monster Energy, the meanest energy drink on the planet. 500ml Original Green.',
    imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=600',
    imageVerified: true,
    baseQuantity: 500,
    baseUnit: 'ml',
    subcategory: 'Energy Drinks',
    variant: '500ml Can',
    listings: [
      { sellerName: 'Blinkit', price: 125.00, originalPrice: 135.00, unitPrice: 0.25, sellerUrl: 'https://blinkit.com', productUrl: 'https://blinkit.com/s/?q=monster+500ml', rating: 4.7, reviewCount: 3400, deliveryTime: '10 mins' },
      { sellerName: 'Swiggy Instamart', price: 120.00, originalPrice: 135.00, unitPrice: 0.24, sellerUrl: 'https://swiggy.com/instamart', productUrl: 'https://swiggy.com/instamart/search?q=monster+500ml', rating: 4.8, reviewCount: 2800, deliveryTime: '12 mins' },
      { sellerName: 'Zepto', price: 119.00, originalPrice: 135.00, unitPrice: 0.238, sellerUrl: 'https://zepto.com', productUrl: 'https://zepto.com/search?q=monster+500ml', rating: 4.9, reviewCount: 4100, deliveryTime: '8 mins' },
      { sellerName: 'BigBasket', price: 122.00, originalPrice: 135.00, unitPrice: 0.244, sellerUrl: 'https://bigbasket.com', productUrl: 'https://bigbasket.com/ps/?q=monster+500ml', rating: 4.6, reviewCount: 1900, deliveryTime: '2 hours' },
      { sellerName: 'JioMart', price: 115.00, originalPrice: 135.00, unitPrice: 0.23, sellerUrl: 'https://jiomart.com', productUrl: 'https://jiomart.com/search/monster+500ml', rating: 4.5, reviewCount: 1200, deliveryTime: 'Tomorrow' }
    ]
  },
  {
    name: 'Atomic Habits Paperback by James Clear',
    category: 'Books',
    categoryType: 'ELECTRONICS', // General marketplace mapping (Amazon, Flipkart, Meesho)
    brand: 'Penguin Random House',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear. Paperback Edition.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600',
    imageVerified: true,
    baseQuantity: 1,
    baseUnit: 'copy',
    subcategory: 'Self-Help Books',
    variant: 'Paperback Edition',
    listings: [
      { sellerName: 'Amazon', price: 349.00, originalPrice: 799.00, unitPrice: 349.00, sellerUrl: 'https://amazon.in', productUrl: 'https://amazon.in/dp/1847941834', rating: 4.8, reviewCount: 89000, deliveryTime: 'Tomorrow' },
      { sellerName: 'Flipkart', price: 365.00, originalPrice: 799.00, unitPrice: 365.00, sellerUrl: 'https://flipkart.com', productUrl: 'https://flipkart.com/p/itm12345', rating: 4.7, reviewCount: 45000, deliveryTime: '2 Days' },
      { sellerName: 'Meesho', price: 299.00, originalPrice: 799.00, unitPrice: 299.00, sellerUrl: 'https://meesho.com', productUrl: 'https://meesho.com/s/p/atomic-habits', rating: 4.5, reviewCount: 12000, deliveryTime: '3 Days' }
    ]
  },
  {
    name: 'Acer Nitro V15 Gaming Laptop (Ryzen 5 / RTX 3050 / 16GB RAM / 512GB SSD)',
    category: 'Laptops',
    categoryType: 'ELECTRONICS',
    brand: 'Acer',
    description: 'Acer Nitro V15 Gaming Laptop featuring AMD Ryzen 5 processor, NVIDIA GeForce RTX 3050 4GB GPU, 16GB DDR5 RAM, and 512GB PCIe Gen4 SSD.',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600',
    imageVerified: true,
    baseQuantity: 1,
    baseUnit: 'unit',
    subcategory: 'Gaming Laptops',
    variant: 'Ryzen 5 / RTX 3050 / 16GB / 512GB SSD',
    listings: [
      { sellerName: 'Amazon', price: 54990.00, originalPrice: 76999.00, unitPrice: 54990.00, sellerUrl: 'https://amazon.in', productUrl: 'https://amazon.in/dp/B0CJSWY789', rating: 4.4, reviewCount: 3200, deliveryTime: 'Tomorrow' },
      { sellerName: 'Flipkart', price: 53990.00, originalPrice: 76999.00, unitPrice: 53990.00, sellerUrl: 'https://flipkart.com', productUrl: 'https://flipkart.com/p/itm54990nitro', rating: 4.5, reviewCount: 4100, deliveryTime: '2 Days' },
      { sellerName: 'Meesho', price: 52990.00, originalPrice: 76999.00, unitPrice: 52990.00, sellerUrl: 'https://meesho.com', productUrl: 'https://meesho.com/s/p/acer-nitro-v15', rating: 4.3, reviewCount: 890, deliveryTime: '4 Days' }
    ]
  }
];

async function main() {
  console.log('🌱 Starting safe smart catalog seeding...');

  for (const item of SMART_PRODUCTS) {
    let product = await prisma.product.findFirst({
      where: { name: item.name }
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: item.name,
          category: item.category,
          categoryType: item.categoryType,
          brand: item.brand,
          description: item.description,
          imageUrl: item.imageUrl,
          imageVerified: item.imageVerified,
          baseQuantity: item.baseQuantity,
          baseUnit: item.baseUnit,
          subcategory: item.subcategory
        }
      });
      console.log(`+ Created product: ${product.name}`);
    } else {
      console.log(`= Found existing product: ${product.name}`);
    }

    for (const l of item.listings) {
      let listing = await prisma.productListing.findFirst({
        where: {
          productId: product.id,
          sellerName: l.sellerName
        }
      });

      if (!listing) {
        await prisma.productListing.create({
          data: {
            productId: product.id,
            sellerName: l.sellerName,
            sellerUrl: l.sellerUrl,
            productUrl: l.productUrl,
            price: l.price,
            originalPrice: l.originalPrice,
            unitPrice: l.unitPrice,
            variant: item.variant,
            rating: l.rating,
            reviewCount: l.reviewCount,
            deliveryTime: l.deliveryTime,
            availability: 'IN_STOCK',
            priceStatus: 'DEMO_PRICE',
            imageStatus: 'VERIFIED',
            matchConfidence: 'EXACT',
            matchScore: 100,
            priceSource: 'catalog'
          }
        });
      } else {
        await prisma.productListing.update({
          where: { id: listing.id },
          data: {
            price: l.price,
            originalPrice: l.originalPrice,
            unitPrice: l.unitPrice,
            rating: l.rating,
            reviewCount: l.reviewCount,
            priceStatus: 'DEMO_PRICE',
            availability: 'IN_STOCK'
          }
        });
      }
    }
  }

  console.log('✅ Smart catalog seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
