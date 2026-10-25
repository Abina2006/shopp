import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS = [
  // ==========================================
  // ELECTRONICS (Amazon, Flipkart, Meesho)
  // ==========================================
  {
    name: 'Apple iPhone 15 (128 GB) - Black',
    category: 'Smartphones',
    subcategory: 'Mobile',
    categoryType: 'ELECTRONICS',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600',
    description: 'Dynamic Island, 48MP Main camera, USB-C, and durable color-infused glass and aluminum design.',
    baseQuantity: 1,
    baseUnit: 'unit',
    listings: [
      {
        sellerName: 'Flipkart',
        sellerUrl: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4',
        productUrl: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4',
        price: 65499,
        originalPrice: 79900,
        discount: 18,
        rating: 4.6,
        reviewCount: 14200,
        deliveryTime: '1-2 Days',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Amazon',
        sellerUrl: 'https://www.amazon.in/dp/B0CHX1W1XY',
        productUrl: 'https://www.amazon.in/dp/B0CHX1W1XY',
        price: 65999,
        originalPrice: 79900,
        discount: 17,
        rating: 4.5,
        reviewCount: 18900,
        deliveryTime: 'Same Day / Tomorrow',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'HP Pavilion 15 12th Gen Intel Core i5 Laptop',
    category: 'Computers',
    subcategory: 'Laptops',
    categoryType: 'ELECTRONICS',
    brand: 'HP',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600',
    description: '15.6-inch FHD, 16GB DDR4 RAM, 512GB SSD, Intel Iris Xe Graphics, Backlit Keyboard, Windows 11.',
    baseQuantity: 1,
    baseUnit: 'unit',
    listings: [
      {
        sellerName: 'Flipkart',
        sellerUrl: 'https://www.flipkart.com/search?q=hp+pavilion+15+i5',
        productUrl: 'https://www.flipkart.com/search?q=hp+pavilion+15+i5',
        price: 54990,
        originalPrice: 68500,
        discount: 20,
        rating: 4.4,
        reviewCount: 3820,
        deliveryTime: '2-3 Days',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Amazon',
        sellerUrl: 'https://www.amazon.in/dp/B0C63J32BG',
        productUrl: 'https://www.amazon.in/dp/B0C63J32BG',
        price: 56990,
        originalPrice: 68500,
        discount: 17,
        rating: 4.3,
        reviewCount: 4100,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Apple MacBook Air M2 Chip (13.6-inch, 8GB RAM, 256GB SSD)',
    category: 'Computers',
    subcategory: 'Laptops',
    categoryType: 'ELECTRONICS',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600',
    description: 'Liquid Retina Display, 1080p FaceTime HD Camera, MagSafe Charging, All-Day Battery Life.',
    baseQuantity: 1,
    baseUnit: 'unit',
    listings: [
      {
        sellerName: 'Flipkart',
        sellerUrl: 'https://www.flipkart.com/search?q=macbook+air+m2',
        productUrl: 'https://www.flipkart.com/search?q=macbook+air+m2',
        price: 88990,
        originalPrice: 99900,
        discount: 11,
        rating: 4.7,
        reviewCount: 6500,
        deliveryTime: '2 Days',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Amazon',
        sellerUrl: 'https://www.amazon.in/dp/B0B3BM6W7L',
        productUrl: 'https://www.amazon.in/dp/B0B3BM6W7L',
        price: 89990,
        originalPrice: 99900,
        discount: 10,
        rating: 4.7,
        reviewCount: 8200,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'boAt Airdopes Alpha True Wireless Earbuds',
    category: 'Audio',
    subcategory: 'Audio',
    categoryType: 'ELECTRONICS',
    brand: 'boAt',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
    description: '35 Hours Playback, 13mm Drivers, ENx Tech Dual Mics, ASAP Charge, IPX5 Water Resistance.',
    baseQuantity: 1,
    baseUnit: 'unit',
    listings: [
      {
        sellerName: 'Meesho',
        sellerUrl: 'https://www.meesho.com/search?q=boat+airdopes+alpha',
        productUrl: 'https://www.meesho.com/search?q=boat+airdopes+alpha',
        price: 799,
        originalPrice: 3490,
        discount: 77,
        rating: 4.1,
        reviewCount: 1540,
        deliveryTime: '3-4 Days',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Amazon',
        sellerUrl: 'https://www.amazon.in/dp/B0C78F7Q8Z',
        productUrl: 'https://www.amazon.in/dp/B0C78F7Q8Z',
        price: 899,
        originalPrice: 3490,
        discount: 74,
        rating: 4.0,
        reviewCount: 42100,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Flipkart',
        sellerUrl: 'https://www.flipkart.com/search?q=boat+airdopes+alpha',
        productUrl: 'https://www.flipkart.com/search?q=boat+airdopes+alpha',
        price: 899,
        originalPrice: 3490,
        discount: 74,
        rating: 4.1,
        reviewCount: 38900,
        deliveryTime: '2 Days',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'Audio',
    subcategory: 'Audio',
    categoryType: 'ELECTRONICS',
    brand: 'Sony',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
    description: 'Industry Leading Noise Cancellation, 30-Hour Battery, Crystal Clear Hands-Free Calling, Multipoint Connection.',
    baseQuantity: 1,
    baseUnit: 'unit',
    listings: [
      {
        sellerName: 'Flipkart',
        sellerUrl: 'https://www.flipkart.com/search?q=sony+wh+1000xm5',
        productUrl: 'https://www.flipkart.com/search?q=sony+wh+1000xm5',
        price: 28990,
        originalPrice: 34990,
        discount: 17,
        rating: 4.6,
        reviewCount: 2900,
        deliveryTime: '2 Days',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Amazon',
        sellerUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
        productUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
        price: 29990,
        originalPrice: 34990,
        discount: 14,
        rating: 4.6,
        reviewCount: 4800,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Samsung Galaxy Watch 6 LTE (44mm, Bluetooth + 4G)',
    category: 'Wearables',
    subcategory: 'Wearables',
    categoryType: 'ELECTRONICS',
    brand: 'Samsung',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
    description: 'Advanced Sleep Coaching, ECG & Blood Pressure Tracking, Body Composition Analysis, Sapphire Crystal Glass.',
    baseQuantity: 1,
    baseUnit: 'unit',
    listings: [
      {
        sellerName: 'Flipkart',
        sellerUrl: 'https://www.flipkart.com/search?q=samsung+galaxy+watch+6',
        productUrl: 'https://www.flipkart.com/search?q=samsung+galaxy+watch+6',
        price: 18999,
        originalPrice: 36999,
        discount: 49,
        rating: 4.4,
        reviewCount: 1850,
        deliveryTime: '2 Days',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Amazon',
        sellerUrl: 'https://www.amazon.in/dp/B0CC95B6FD',
        productUrl: 'https://www.amazon.in/dp/B0CC95B6FD',
        price: 19999,
        originalPrice: 36999,
        discount: 46,
        rating: 4.3,
        reviewCount: 2300,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      }
    ]
  },

  // =========================================================================
  // GROCERY / SNACKS / DAILY NEEDS (Blinkit, Instamart, Zepto, BigBasket, JioMart)
  // =========================================================================
  {
    name: 'Kurkure Masala Munch Crisps (90g)',
    category: 'Snacks',
    subcategory: 'Chips & Crisps',
    categoryType: 'GROCERY',
    brand: 'Kurkure',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600',
    description: 'Crispy crunchy puffed snack with authentic spicy Indian masala flavor. Made with dal and rice blend.',
    baseQuantity: 90,
    baseUnit: 'g',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/p/groceries/kurkure-masala-munch-90-g/490001234',
        productUrl: 'https://www.jiomart.com/p/groceries/kurkure-masala-munch-90-g/490001234',
        price: 18,
        originalPrice: 20,
        discount: 10,
        rating: 4.6,
        reviewCount: 4200,
        deliveryTime: 'Today by 8 PM',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/pn/kurkure-masala-munch',
        productUrl: 'https://www.zeptonow.com/pn/kurkure-masala-munch',
        price: 19,
        originalPrice: 20,
        discount: 5,
        rating: 4.8,
        reviewCount: 3100,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/prn/kurkure-masala-munch-crisps/prid/1244',
        productUrl: 'https://blinkit.com/prn/kurkure-masala-munch-crisps/prid/1244',
        price: 20,
        originalPrice: 20,
        discount: 0,
        rating: 4.7,
        reviewCount: 8900,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/item/kurkure-masala-munch',
        productUrl: 'https://www.swiggy.com/instamart/item/kurkure-masala-munch',
        price: 20,
        originalPrice: 20,
        discount: 0,
        rating: 4.7,
        reviewCount: 6500,
        deliveryTime: '12 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/pd/100012/kurkure-namkeen-masala-munch-90-g',
        productUrl: 'https://www.bigbasket.com/pd/100012/kurkure-namkeen-masala-munch-90-g',
        price: 20,
        originalPrice: 20,
        discount: 0,
        rating: 4.5,
        reviewCount: 5200,
        deliveryTime: 'Tomorrow Morning',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Amul Taaza Homogenised Toned Milk (500ml Pouch)',
    category: 'Dairy',
    subcategory: 'Milk',
    categoryType: 'GROCERY',
    brand: 'Amul',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600',
    description: 'Fresh pasteurized and homogenized toned milk with 3.0% minimum fat and 8.5% minimum SNF.',
    baseQuantity: 500,
    baseUnit: 'ml',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/p/groceries/amul-taaza-homogenised-toned-milk-500-ml/490008871',
        productUrl: 'https://www.jiomart.com/p/groceries/amul-taaza-homogenised-toned-milk-500-ml/490008871',
        price: 26,
        originalPrice: 27,
        discount: 4,
        rating: 4.8,
        reviewCount: 9500,
        deliveryTime: 'Today by 8 PM',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/prn/amul-taaza-toned-milk/prid/3452',
        productUrl: 'https://blinkit.com/prn/amul-taaza-toned-milk/prid/3452',
        price: 27,
        originalPrice: 27,
        discount: 0,
        rating: 4.9,
        reviewCount: 24500,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/item/amul-taaza-toned-fresh-milk-500-ml',
        productUrl: 'https://www.swiggy.com/instamart/item/amul-taaza-toned-fresh-milk-500-ml',
        price: 27,
        originalPrice: 27,
        discount: 0,
        rating: 4.9,
        reviewCount: 18200,
        deliveryTime: '11 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/pn/amul-taaza-toned-milk-500ml',
        productUrl: 'https://www.zeptonow.com/pn/amul-taaza-toned-milk-500ml',
        price: 27,
        originalPrice: 27,
        discount: 0,
        rating: 4.8,
        reviewCount: 14200,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/pd/306926/amul-taaza-homogenised-toned-milk-500-ml-pouch',
        productUrl: 'https://www.bigbasket.com/pd/306926/amul-taaza-homogenised-toned-milk-500-ml-pouch',
        price: 27,
        originalPrice: 27,
        discount: 0,
        rating: 4.7,
        reviewCount: 8900,
        deliveryTime: 'Tomorrow Morning',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Nandini Pasteurized Toned Milk (500ml)',
    category: 'Dairy',
    subcategory: 'Milk',
    categoryType: 'GROCERY',
    brand: 'Nandini',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600',
    description: 'Pure, fresh and pasteurized toned cow milk enriched with Vitamin A & D.',
    baseQuantity: 500,
    baseUnit: 'ml',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/search/nandini-milk',
        productUrl: 'https://www.jiomart.com/search/nandini-milk',
        price: 23,
        originalPrice: 24,
        discount: 4,
        rating: 4.7,
        reviewCount: 3100,
        deliveryTime: 'Today',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/s/?q=Nandini+Milk',
        productUrl: 'https://blinkit.com/s/?q=Nandini+Milk',
        price: 24,
        originalPrice: 24,
        discount: 0,
        rating: 4.8,
        reviewCount: 7800,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/search?query=Nandini+Milk',
        productUrl: 'https://www.swiggy.com/instamart/search?query=Nandini+Milk',
        price: 24,
        originalPrice: 24,
        discount: 0,
        rating: 4.8,
        reviewCount: 5600,
        deliveryTime: '12 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/search?q=Nandini+Milk',
        productUrl: 'https://www.zeptonow.com/search?q=Nandini+Milk',
        price: 24,
        originalPrice: 24,
        discount: 0,
        rating: 4.7,
        reviewCount: 4200,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/ps/?q=nandini+milk',
        productUrl: 'https://www.bigbasket.com/ps/?q=nandini+milk',
        price: 24,
        originalPrice: 24,
        discount: 0,
        rating: 4.6,
        reviewCount: 3900,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Amul Masti Dahi / Pouch Curd (400g)',
    category: 'Dairy',
    subcategory: 'Curd & Yogurt',
    categoryType: 'GROCERY',
    brand: 'Amul',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600',
    description: 'Thick, creamy and delicious pasteurized curd made from standardized milk. Great for raita, lassi, or direct consumption.',
    baseQuantity: 400,
    baseUnit: 'g',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/search/amul-masti-dahi',
        productUrl: 'https://www.jiomart.com/search/amul-masti-dahi',
        price: 32,
        originalPrice: 35,
        discount: 9,
        rating: 4.7,
        reviewCount: 2800,
        deliveryTime: 'Today',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/search?q=Curd',
        productUrl: 'https://www.zeptonow.com/search?q=Curd',
        price: 34,
        originalPrice: 35,
        discount: 3,
        rating: 4.8,
        reviewCount: 4500,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/s/?q=Curd',
        productUrl: 'https://blinkit.com/s/?q=Curd',
        price: 35,
        originalPrice: 35,
        discount: 0,
        rating: 4.8,
        reviewCount: 11200,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/search?query=Curd',
        productUrl: 'https://www.swiggy.com/instamart/search?query=Curd',
        price: 35,
        originalPrice: 35,
        discount: 0,
        rating: 4.7,
        reviewCount: 8900,
        deliveryTime: '12 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/ps/?q=amul+dahi',
        productUrl: 'https://www.bigbasket.com/ps/?q=amul+dahi',
        price: 35,
        originalPrice: 35,
        discount: 0,
        rating: 4.6,
        reviewCount: 6100,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch)',
    category: 'Cooking Essentials',
    subcategory: 'Edible Oils',
    categoryType: 'GROCERY',
    brand: 'Fortune',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600',
    description: 'Light and healthy refined sunflower oil enriched with vitamins A and D. High smoke point ideal for daily cooking and frying.',
    baseQuantity: 1,
    baseUnit: 'L',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/search/fortune-sunflower-oil',
        productUrl: 'https://www.jiomart.com/search/fortune-sunflower-oil',
        price: 128,
        originalPrice: 155,
        discount: 17,
        rating: 4.5,
        reviewCount: 3900,
        deliveryTime: 'Today',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/ps/?q=fortune+sunflower+oil',
        productUrl: 'https://www.bigbasket.com/ps/?q=fortune+sunflower+oil',
        price: 130,
        originalPrice: 155,
        discount: 16,
        rating: 4.6,
        reviewCount: 7800,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/search?q=fortune+oil',
        productUrl: 'https://www.zeptonow.com/search?q=fortune+oil',
        price: 132,
        originalPrice: 155,
        discount: 15,
        rating: 4.7,
        reviewCount: 3100,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/s/?q=fortune+sunflower+oil',
        productUrl: 'https://blinkit.com/s/?q=fortune+sunflower+oil',
        price: 135,
        originalPrice: 155,
        discount: 13,
        rating: 4.7,
        reviewCount: 5400,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/search?query=fortune+oil',
        productUrl: 'https://www.swiggy.com/instamart/search?query=fortune+oil',
        price: 139,
        originalPrice: 155,
        discount: 10,
        rating: 4.6,
        reviewCount: 4200,
        deliveryTime: '12 Mins',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Tata Tea Gold Premium Black Tea (500g)',
    category: 'Beverages',
    subcategory: 'Tea',
    categoryType: 'GROCERY',
    brand: 'Tata Tea',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600',
    description: 'Unique blend of fine Assam tea leaves with gently rolled long leaves for rich taste and aroma.',
    baseQuantity: 500,
    baseUnit: 'g',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/search/tata-tea-gold',
        productUrl: 'https://www.jiomart.com/search/tata-tea-gold',
        price: 290,
        originalPrice: 340,
        discount: 15,
        rating: 4.7,
        reviewCount: 3400,
        deliveryTime: 'Today',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/ps/?q=tata+tea+gold',
        productUrl: 'https://www.bigbasket.com/ps/?q=tata+tea+gold',
        price: 295,
        originalPrice: 340,
        discount: 13,
        rating: 4.6,
        reviewCount: 5600,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/search?q=tata+tea+gold',
        productUrl: 'https://www.zeptonow.com/search?q=tata+tea+gold',
        price: 305,
        originalPrice: 340,
        discount: 10,
        rating: 4.8,
        reviewCount: 2200,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/s/?q=tata+tea+gold',
        productUrl: 'https://blinkit.com/s/?q=tata+tea+gold',
        price: 310,
        originalPrice: 340,
        discount: 9,
        rating: 4.8,
        reviewCount: 6800,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/search?query=tata+tea+gold',
        productUrl: 'https://www.swiggy.com/instamart/search?query=tata+tea+gold',
        price: 315,
        originalPrice: 340,
        discount: 7,
        rating: 4.7,
        reviewCount: 4100,
        deliveryTime: '12 Mins',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Daawat Rozana Super Basmati Rice (5kg)',
    category: 'Staples',
    subcategory: 'Rice & Grains',
    categoryType: 'GROCERY',
    brand: 'Daawat',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600',
    description: 'Long grain, aromatic basmati rice for daily family meals, biryani, and pulao.',
    baseQuantity: 5,
    baseUnit: 'kg',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/search/daawat-basmati-rice',
        productUrl: 'https://www.jiomart.com/search/daawat-basmati-rice',
        price: 350,
        originalPrice: 440,
        discount: 20,
        rating: 4.5,
        reviewCount: 2900,
        deliveryTime: 'Today',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/ps/?q=daawat+rozana+super',
        productUrl: 'https://www.bigbasket.com/ps/?q=daawat+rozana+super',
        price: 369,
        originalPrice: 440,
        discount: 16,
        rating: 4.6,
        reviewCount: 4800,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/search?q=daawat+rice',
        productUrl: 'https://www.zeptonow.com/search?q=daawat+rice',
        price: 375,
        originalPrice: 440,
        discount: 15,
        rating: 4.7,
        reviewCount: 1600,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/s/?q=daawat+basmati+rice',
        productUrl: 'https://blinkit.com/s/?q=daawat+basmati+rice',
        price: 380,
        originalPrice: 440,
        discount: 14,
        rating: 4.6,
        reviewCount: 3100,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/search?query=daawat+rice',
        productUrl: 'https://www.swiggy.com/instamart/search?query=daawat+rice',
        price: 395,
        originalPrice: 440,
        discount: 10,
        rating: 4.5,
        reviewCount: 2200,
        deliveryTime: '12 Mins',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Dettol Original Bathing Soap Bar (75g x 4 Packs)',
    category: 'Personal Care',
    subcategory: 'Soaps',
    categoryType: 'GROCERY',
    brand: 'Dettol',
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600',
    description: 'Germ protection bathing soap with iconic pine fragrance and nourishing moisturizers.',
    baseQuantity: 300,
    baseUnit: 'g',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/search/dettol-soap',
        productUrl: 'https://www.jiomart.com/search/dettol-soap',
        price: 145,
        originalPrice: 175,
        discount: 17,
        rating: 4.7,
        reviewCount: 4200,
        deliveryTime: 'Today',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/ps/?q=dettol+soap',
        productUrl: 'https://www.bigbasket.com/ps/?q=dettol+soap',
        price: 150,
        originalPrice: 175,
        discount: 14,
        rating: 4.7,
        reviewCount: 6800,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/search?q=dettol+soap',
        productUrl: 'https://www.zeptonow.com/search?q=dettol+soap',
        price: 155,
        originalPrice: 175,
        discount: 11,
        rating: 4.8,
        reviewCount: 2900,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/s/?q=dettol+soap',
        productUrl: 'https://blinkit.com/s/?q=dettol+soap',
        price: 160,
        originalPrice: 175,
        discount: 9,
        rating: 4.8,
        reviewCount: 8400,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/search?query=dettol+soap',
        productUrl: 'https://www.swiggy.com/instamart/search?query=dettol+soap',
        price: 165,
        originalPrice: 175,
        discount: 6,
        rating: 4.7,
        reviewCount: 5100,
        deliveryTime: '12 Mins',
        availability: 'IN_STOCK'
      }
    ]
  },
  {
    name: 'Dove Daily Shine Hair Shampoo (650ml)',
    category: 'Personal Care',
    subcategory: 'Hair Care',
    categoryType: 'GROCERY',
    brand: 'Dove',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600',
    description: 'Enriched with Nutritive Serum for smooth, shiny and manageable daily hair care.',
    baseQuantity: 650,
    baseUnit: 'ml',
    listings: [
      {
        sellerName: 'JioMart',
        sellerUrl: 'https://www.jiomart.com/search/dove-shampoo',
        productUrl: 'https://www.jiomart.com/search/dove-shampoo',
        price: 460,
        originalPrice: 599,
        discount: 23,
        rating: 4.6,
        reviewCount: 2900,
        deliveryTime: 'Today',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'BigBasket',
        sellerUrl: 'https://www.bigbasket.com/ps/?q=dove+shampoo',
        productUrl: 'https://www.bigbasket.com/ps/?q=dove+shampoo',
        price: 475,
        originalPrice: 599,
        discount: 21,
        rating: 4.7,
        reviewCount: 5200,
        deliveryTime: 'Tomorrow',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Zepto',
        sellerUrl: 'https://www.zeptonow.com/search?q=dove+shampoo',
        productUrl: 'https://www.zeptonow.com/search?q=dove+shampoo',
        price: 489,
        originalPrice: 599,
        discount: 18,
        rating: 4.8,
        reviewCount: 1900,
        deliveryTime: '10 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Blinkit',
        sellerUrl: 'https://blinkit.com/s/?q=dove+shampoo',
        productUrl: 'https://blinkit.com/s/?q=dove+shampoo',
        price: 499,
        originalPrice: 599,
        discount: 17,
        rating: 4.8,
        reviewCount: 7100,
        deliveryTime: '8 Mins',
        availability: 'IN_STOCK'
      },
      {
        sellerName: 'Instamart',
        sellerUrl: 'https://www.swiggy.com/instamart/search?query=dove+shampoo',
        productUrl: 'https://www.swiggy.com/instamart/search?query=dove+shampoo',
        price: 510,
        originalPrice: 599,
        discount: 15,
        rating: 4.7,
        reviewCount: 3800,
        deliveryTime: '12 Mins',
        availability: 'IN_STOCK'
      }
    ]
  }
];

async function seed() {
  console.log('🌱 Starting unified catalog seeding...');

  let createdCount = 0;
  let listingCount = 0;

  for (const item of PRODUCTS) {
    // Find or create product
    let product = await prisma.product.findFirst({
      where: { name: item.name }
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          categoryType: item.categoryType,
          brand: item.brand,
          imageUrl: item.imageUrl,
          description: item.description,
          baseQuantity: item.baseQuantity,
          baseUnit: item.baseUnit,
        }
      });
      createdCount++;
    } else {
      product = await prisma.product.update({
        where: { id: product.id },
        data: {
          category: item.category,
          subcategory: item.subcategory,
          categoryType: item.categoryType,
          brand: item.brand,
          imageUrl: item.imageUrl,
          description: item.description,
          baseQuantity: item.baseQuantity,
          baseUnit: item.baseUnit,
        }
      });
    }

    // Upsert listings
    for (const l of item.listings) {
      const existing = await prisma.productListing.findFirst({
        where: {
          productId: product.id,
          sellerName: l.sellerName
        }
      });

      if (!existing) {
        const createdListing = await prisma.productListing.create({
          data: {
            productId: product.id,
            sellerName: l.sellerName,
            sellerUrl: l.sellerUrl,
            productUrl: l.productUrl,
            price: l.price,
            originalPrice: l.originalPrice,
            discount: l.discount,
            rating: l.rating,
            reviewCount: l.reviewCount,
            deliveryTime: l.deliveryTime,
            availability: l.availability || 'IN_STOCK',
            lastScrapedAt: new Date()
          }
        });

        await prisma.priceHistory.create({
          data: {
            listingId: createdListing.id,
            price: l.price,
            recordedAt: new Date()
          }
        }).catch(() => {});

        listingCount++;
      } else {
        await prisma.productListing.update({
          where: { id: existing.id },
          data: {
            sellerUrl: l.sellerUrl,
            productUrl: l.productUrl,
            price: l.price,
            originalPrice: l.originalPrice,
            discount: l.discount,
            rating: l.rating,
            reviewCount: l.reviewCount,
            deliveryTime: l.deliveryTime,
            availability: l.availability || 'IN_STOCK',
            lastScrapedAt: new Date()
          }
        });
        listingCount++;
      }
    }
  }

  const totalProducts = await prisma.product.count();
  const totalListings = await prisma.productListing.count();

  console.log(`✅ Seeding complete!`);
  console.log(`📊 Total Products in DB: ${totalProducts}`);
  console.log(`📊 Total Listings in DB: ${totalListings}`);
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
