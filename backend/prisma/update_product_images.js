import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Comprehensive product image map — keyword → high-quality Unsplash image URL
const IMAGE_MAP = [
  // Apple products
  { keywords: ['macbook pro'], url: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?q=80&w=600' },
  { keywords: ['macbook air'], url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600' },
  { keywords: ['macbook'], url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600' },
  { keywords: ['iphone 15 pro', 'iphone 15pro'], url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600' },
  { keywords: ['iphone 15'], url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600' },
  { keywords: ['iphone 14'], url: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?q=80&w=600' },
  { keywords: ['iphone'], url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600' },
  { keywords: ['airpods pro'], url: 'https://images.unsplash.com/photo-1615655406736-b37892a2f38d?q=80&w=600' },
  { keywords: ['airpods'], url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=600' },
  { keywords: ['apple watch series 9', 'apple watch s9'], url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600' },
  { keywords: ['apple watch'], url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600' },
  { keywords: ['ipad air'], url: 'https://images.unsplash.com/photo-1609581715208-fd9d8bc1e930?q=80&w=600' },
  { keywords: ['ipad pro'], url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600' },
  { keywords: ['ipad'], url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600' },

  // Samsung products
  { keywords: ['samsung galaxy s24 ultra'], url: 'https://images.unsplash.com/photo-1706193822890-5f5892c0e8ae?q=80&w=600' },
  { keywords: ['samsung galaxy s24'], url: 'https://images.unsplash.com/photo-1710558155524-8eda65dda8eb?q=80&w=600' },
  { keywords: ['samsung galaxy s23'], url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=600' },
  { keywords: ['samsung galaxy buds'], url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600' },
  { keywords: ['samsung galaxy watch 6'], url: 'https://images.unsplash.com/photo-1695682726798-6c89d24c8ffe?q=80&w=600' },
  { keywords: ['samsung galaxy watch'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' },

  // Headphones & Audio
  { keywords: ['sony wh-1000xm5'], url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600' },
  { keywords: ['sony wh-1000xm4'], url: 'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=600' },
  { keywords: ['sony wh-ch720n', 'sony wh720n'], url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600' },
  { keywords: ['sony wh'], url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600' },
  { keywords: ['jbl tune 670nc', 'jbl tune'], url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600' },
  { keywords: ['jbl'], url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600' },
  { keywords: ['boat airdopes alpha'], url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=600' },
  { keywords: ['boat airdopes 141'], url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=600' },
  { keywords: ['boat rockerz'], url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600' },
  { keywords: ['boat'], url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=600' },
  { keywords: ['hoppup arcx', 'hoppup xo3', 'hoppup'], url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600' },
  { keywords: ['noise colorfit'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' },
  { keywords: ['bose quietcomfort', 'bose qc'], url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600' },

  // Laptops
  { keywords: ['lenovo legion 5 pro'], url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=600' },
  { keywords: ['lenovo legion'], url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=600' },
  { keywords: ['lenovo ideapad slim'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600' },
  { keywords: ['lenovo ideapad'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600' },
  { keywords: ['lenovo thinkpad'], url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600' },
  { keywords: ['asus vivobook'], url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600' },
  { keywords: ['asus zenbook'], url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600' },
  { keywords: ['asus rog'], url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=600' },
  { keywords: ['dell xps 13'], url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=600' },
  { keywords: ['dell xps'], url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=600' },
  { keywords: ['hp pavilion'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600' },
  { keywords: ['hp envy'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600' },
  { keywords: ['hp spectre'], url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=600' },

  // Phones
  { keywords: ['google pixel 8 pro'], url: 'https://images.unsplash.com/photo-1509822929074-f7c1a3d0a7e1?q=80&w=600' },
  { keywords: ['google pixel'], url: 'https://images.unsplash.com/photo-1509822929074-f7c1a3d0a7e1?q=80&w=600' },
  { keywords: ['redmi note 13 pro'], url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' },
  { keywords: ['redmi note 13'], url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' },
  { keywords: ['oneplus 12'], url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' },
  { keywords: ['oneplus'], url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' },

  // Watches
  { keywords: ['fitbit'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' },
  { keywords: ['noise colorfit'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' },
  { keywords: ['boat wave'], url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600' },

  // Shoes / Footwear
  { keywords: ['adidas ultraboost'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },
  { keywords: ['nike air max'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },
  { keywords: ['nike'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },
  { keywords: ['adidas'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },
  { keywords: ['puma'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },
  { keywords: ['crocs'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },
  { keywords: ['sneaker', 'shoe', 'boot', 'footwear', 'sandal'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },

  // Clothing
  { keywords: ["levi's", 'levis', 'levi s'], url: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=600' },
  { keywords: ['kurti', 'saree', 'salwar', 'ethnic'], url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600' },
  { keywords: ['t-shirt', 'tshirt', 't shirt'], url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600' },
  { keywords: ['shirt', 'dress shirt'], url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=600' },
  { keywords: ['jeans', 'denim'], url: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=600' },

  // Gaming
  { keywords: ['ps5', 'playstation 5'], url: 'https://images.unsplash.com/photo-1607016284318-d1384f79d4e4?q=80&w=600' },
  { keywords: ['xbox'], url: 'https://images.unsplash.com/photo-1593107681010-6de0ccd7e000?q=80&w=600' },
  { keywords: ['gaming'], url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=600' },
  
  // Accessories
  { keywords: ['microphone', 'lavalier'], url: 'https://images.unsplash.com/photo-1598550473359-433a6f6f8f66?q=80&w=600' },
  { keywords: ['camera', 'dslr'], url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600' },
  { keywords: ['tablet'], url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600' },
  { keywords: ['monitor', 'display'], url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600' },
  { keywords: ['keyboard'], url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600' },
  { keywords: ['mouse'], url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600' },
  { keywords: ['charger', 'cable'], url: 'https://images.unsplash.com/photo-1583863788434-e62bd7c3f430?q=80&w=600' },
  { keywords: ['powerbank', 'power bank'], url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=600' },
  { keywords: ['speaker', 'bluetooth speaker'], url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600' },
  // TV & Home Appliances
  { keywords: ['tv', 'television', 'smart tv', 'oled', 'qled'], url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=600' },
  { keywords: ['air fryer', 'airfryer', 'philips air fryer'], url: 'https://images.unsplash.com/photo-1648170284786-4cc1da37c08b?q=80&w=600' },
  { keywords: ['induction', 'cooktop', 'prestige', 'stove'], url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600' },
  { keywords: ['mixer', 'grinder', 'blender'], url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600' },
  { keywords: ['washing machine'], url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600' },
  { keywords: ['refrigerator', 'fridge'], url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=600' },
  { keywords: ['microwave', 'oven'], url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600' },
  { keywords: ['fan', 'ac', 'air conditioner', 'cooler'], url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600' },

  // Groceries & Food
  { keywords: ['basmati rice', 'daawat', 'rozana rice'], url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600' },
  { keywords: ['rice'], url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600' },
  { keywords: ['tata tea', 'tea gold', 'darjeeling', 'assam tea'], url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=600' },
  { keywords: ['tea', 'chai'], url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=600' },
  { keywords: ['sunflower oil', 'cooking oil', 'fortune oil'], url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600' },
  { keywords: ['oil', 'edible oil'], url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600' },
  { keywords: ['coffee'], url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600' },

  // Personal Care
  { keywords: ['soap', 'dettol', 'dove', 'pears', 'medimix', 'santoor'], url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600' },
  { keywords: ['shampoo', 'tresemme', 'hair care', 'conditioner'], url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600' },
  { keywords: ['perfume', 'fogg', 'cologne', 'eau de parfum', 'deo', 'deodorant'], url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=600' },
  { keywords: ['sunscreen', 'moisturizer', 'face wash', 'cream', 'lotion'], url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600' },

  // Sunglasses & Fashion Accessories
  { keywords: ['ray-ban', 'rayban', 'aviator', 'sunglasses', 'sunglass'], url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600' },
  { keywords: ['bag', 'backpack', 'handbag'], url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600' },
  { keywords: ['wallet', 'purse'], url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600' },

  // Fallback
  { keywords: ['headphone', 'earphone', 'earbud', 'earpiece'], url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600' },
  { keywords: ['laptop', 'notebook'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600' },
  { keywords: ['phone', 'smartphone', 'mobile'], url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' },
  { keywords: ['watch', 'smartwatch'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' },
];

function getImageForProduct(name) {
  const q = name.toLowerCase();
  for (const entry of IMAGE_MAP) {
    if (entry.keywords.some(kw => q.includes(kw))) {
      return entry.url;
    }
  }
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600'; // generic product
}

async function updateImages() {
  console.log('🖼️  Updating product images...');
  const products = await prisma.product.findMany();
  let updated = 0;

  for (const product of products) {
    const imageUrl = getImageForProduct(product.name);
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl }
    });
    console.log(`✅ ${product.name} → ${imageUrl}`);
    updated++;
  }

  console.log(`\n✨ Done! Updated images for ${updated} products.`);
}

updateImages()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
