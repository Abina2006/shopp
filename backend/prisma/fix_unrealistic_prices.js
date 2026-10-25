import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixPrices() {
  console.log('Fixing unrealistic prices in database...');
  const listings = await prisma.productListing.findMany({
    include: { product: true }
  });

  for (const listing of listings) {
    const q = listing.product.name.toLowerCase();
    
    let minPrice = null;
    let maxPrice = null;

    if (q.includes('apple') || q.includes('iphone') || q.includes('mac') || q.includes('s24') || q.includes('s23') || q.includes('pixel') || q.includes('fold') || q.includes('xps') || q.includes('legion') || q.includes('alienware') || q.includes('rog')) {
      minPrice = 60000; maxPrice = 180000;
      if (q.includes('macbook pro')) {
        minPrice = 120000; maxPrice = 300000;
      }
    } else if (q.includes('phone') || q.includes('mobile') || q.includes('smartphone')) {
      minPrice = 15000; maxPrice = 50000;
    } else if (q.includes('laptop') || q.includes('computer') || q.includes('pc') || q.includes('dell') || q.includes('hp') || q.includes('lenovo')) {
      minPrice = 40000; maxPrice = 100000;
    } else if (q.includes('headphone') || q.includes('earbud') || q.includes('earphone') || q.includes('airpod') || q.includes('buds')) {
      minPrice = 2000; maxPrice = 25000;
    } else if (q.includes('watch') || q.includes('smartwatch')) {
      minPrice = 3000; maxPrice = 40000;
    } else if (q.includes('air fryer') || q.includes('airfryer')) {
      minPrice = 3500; maxPrice = 9000;
    } else if (q.includes('induction') || q.includes('cooktop')) {
      minPrice = 1500; maxPrice = 5000;
    } else if (q.includes('refrigerator') || q.includes('fridge') || q.includes('washing machine')) {
      minPrice = 15000; maxPrice = 60000;
    } else if (q.includes('microwave') || q.includes('oven') || q.includes('mixer') || q.includes('grinder')) {
      minPrice = 2000; maxPrice = 8000;
    } else if (q.includes('tv') || q.includes('television') || q.includes('oled') || q.includes('qled')) {
      minPrice = 25000; maxPrice = 150000;
    } else if (q.includes('rice') || q.includes('basmati') || q.includes('atta')) {
      minPrice = 200; maxPrice = 700;
    } else if (q.includes('tea') || q.includes('coffee')) {
      minPrice = 150; maxPrice = 500;
    } else if (q.includes('oil') || q.includes('cooking oil')) {
      minPrice = 100; maxPrice = 250;
    } else if (q.includes('soap') || q.includes('shampoo') || q.includes('conditioner')) {
      minPrice = 100; maxPrice = 500;
    } else if (q.includes('perfume') || q.includes('deodorant') || q.includes('cologne') || q.includes('fogg')) {
      minPrice = 200; maxPrice = 1500;
    } else if (q.includes('sunglasses') || q.includes('ray-ban') || q.includes('rayban')) {
      minPrice = 1000; maxPrice = 12000;
    } else if (q.includes('shoe') || q.includes('sneaker') || q.includes('boot')) {
      minPrice = 1500; maxPrice = 8000;
    } else if (q.includes('shirt') || q.includes('tshirt') || q.includes('clothing') || q.includes('jeans') || q.includes('kurti')) {
      minPrice = 400; maxPrice = 2000;
    }

    if (minPrice && maxPrice) {
      const currentPrice = parseFloat(listing.price);
      
      // Force update if the price is below the realistic minimum OR if it's exactly 20000/10000 (old mock defaults)
      if (currentPrice < minPrice || currentPrice === 20000 || currentPrice === 10000 || currentPrice === 9999) {
        let newPrice = Math.floor(Math.random() * (maxPrice - minPrice)) + minPrice;
        
        if (listing.sellerName.toLowerCase().includes('meesho')) {
          newPrice = Math.floor(newPrice * 0.9);
        } else if (listing.sellerName.toLowerCase().includes('flipkart')) {
          newPrice = Math.floor(newPrice * 0.98);
        }
        
        console.log(`Fixing [${listing.sellerName}] ${listing.product.name} from ${currentPrice} to ${newPrice}`);
        await prisma.productListing.update({
          where: { id: listing.id },
          data: { price: newPrice }
        });
      }
    }
  }

  console.log('Finished updating prices.');
}

fixPrices()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
