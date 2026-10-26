/**
 * Helper to get accurate visual icons, gradient themes, and reliable images for products.
 * Guarantees that soaps never show watches, laptops never show shoes, etc.
 * Supports all 20 shopwiseAI product categories.
 */

export function getProductVisual(product = {}) {
  const name = (product.name || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();

  // 1. Mobiles & Tablets
  if (category.includes('mobile') || category.includes('tablet') || name.includes('iphone') || name.includes('galaxy s') || name.includes('oneplus') || name.includes('ipad') || name.includes('pixel')) {
    return {
      emoji: '📱',
      tag: product.brand || 'Mobiles & Tablets',
      badgeColor: 'from-blue-600 to-indigo-800',
      bgGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
      textColor: 'text-blue-300',
      desc: 'High Performance 5G Smartphone & Tablet',
      fallbackImg: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600'
    };
  }

  // 2. Laptops & Computers
  if (category.includes('laptop') || category.includes('computer') || name.includes('macbook') || name.includes('pavilion') || name.includes('thinkpad') || name.includes('zephyrus')) {
    return {
      emoji: '💻',
      tag: product.brand || 'Laptops & Computers',
      badgeColor: 'from-cyan-600 to-blue-800',
      bgGradient: 'from-cyan-950/80 via-slate-900 to-slate-950',
      textColor: 'text-cyan-300',
      desc: 'Next-Gen Display Laptop & Computing Workstation',
      fallbackImg: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600'
    };
  }

  // 3. Electronics & Accessories
  if (category.includes('electronics') || name.includes('headphone') || name.includes('power bank') || name.includes('apple watch') || name.includes('anker')) {
    return {
      emoji: '🎧',
      tag: product.brand || 'Electronics & Accessories',
      badgeColor: 'from-purple-600 to-indigo-800',
      bgGradient: 'from-purple-950/80 via-slate-900 to-slate-950',
      textColor: 'text-purple-300',
      desc: 'Premium Audio & Smart Electronic Gadgets',
      fallbackImg: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600'
    };
  }

  // 4. Fashion & Clothing
  if (category.includes('fashion') || category.includes('clothing') || name.includes('jean') || name.includes('hoodie') || name.includes('kurta') || name.includes('blazer')) {
    return {
      emoji: '👕',
      tag: product.brand || 'Fashion & Clothing',
      badgeColor: 'from-sky-600 to-indigo-800',
      bgGradient: 'from-sky-950/80 via-slate-900 to-slate-950',
      textColor: 'text-sky-300',
      desc: 'Trendy & Premium Quality Apparel',
      fallbackImg: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=600'
    };
  }

  // 5. Shoes & Footwear
  if (category.includes('shoe') || category.includes('footwear') || name.includes('sneaker') || name.includes('running') || name.includes('crocs') || name.includes('ultraboost')) {
    return {
      emoji: '👟',
      tag: product.brand || 'Shoes & Footwear',
      badgeColor: 'from-rose-600 to-red-800',
      bgGradient: 'from-rose-950/80 via-slate-900 to-slate-950',
      textColor: 'text-rose-300',
      desc: 'Comfort & High Performance Footwear',
      fallbackImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600'
    };
  }

  // 6. Beauty & Personal Care
  if (category.includes('beauty') || category.includes('personal care') || name.includes('shampoo') || name.includes('perfume') || name.includes('dove') || name.includes('lipstick')) {
    return {
      emoji: '💄',
      tag: product.brand || 'Beauty & Personal Care',
      badgeColor: 'from-pink-600 to-rose-800',
      bgGradient: 'from-pink-950/80 via-slate-900 to-slate-950',
      textColor: 'text-pink-300',
      desc: 'Skincare, Haircare & Beauty Essentials',
      fallbackImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600'
    };
  }

  // 7. Home & Kitchen
  if (category.includes('home') || category.includes('kitchen') || name.includes('air fryer') || name.includes('mixer') || name.includes('vacuum') || name.includes('pressure cooker')) {
    return {
      emoji: '🏠',
      tag: product.brand || 'Home & Kitchen',
      badgeColor: 'from-amber-600 to-orange-800',
      bgGradient: 'from-amber-950/80 via-slate-900 to-slate-950',
      textColor: 'text-amber-300',
      desc: 'Smart Home & Everyday Kitchen Appliances',
      fallbackImg: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600'
    };
  }

  // 8. Furniture
  if (category.includes('furniture') || name.includes('sofa') || name.includes('chair') || name.includes('desk') || name.includes('cabinet') || name.includes('table')) {
    return {
      emoji: '🪑',
      tag: product.brand || 'Furniture',
      badgeColor: 'from-amber-700 to-yellow-900',
      bgGradient: 'from-stone-950/80 via-slate-900 to-slate-950',
      textColor: 'text-amber-200',
      desc: 'Ergonomic & Modern Home Furniture',
      fallbackImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600'
    };
  }

  // 9. Toys & Baby Products
  if (category.includes('toy') || category.includes('baby') || name.includes('lego') || name.includes('stroller') || name.includes('hot wheels') || name.includes('fisher-price')) {
    return {
      emoji: '🧸',
      tag: product.brand || 'Toys & Baby Products',
      badgeColor: 'from-yellow-500 to-amber-700',
      bgGradient: 'from-yellow-950/80 via-slate-900 to-slate-950',
      textColor: 'text-yellow-300',
      desc: 'Fun Toys, Games & Essential Baby Care',
      fallbackImg: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=600'
    };
  }

  // 10. Books & Stationery
  if (category.includes('book') || category.includes('stationery') || name.includes('atomic habits') || name.includes('pen') || name.includes('notebook') || name.includes('calculator')) {
    return {
      emoji: '📚',
      tag: product.brand || 'Books & Stationery',
      badgeColor: 'from-teal-600 to-emerald-800',
      bgGradient: 'from-teal-950/80 via-slate-900 to-slate-950',
      textColor: 'text-teal-300',
      desc: 'Bestselling Books & Office Supplies',
      fallbackImg: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600'
    };
  }

  // 11. Sports & Fitness
  if (category.includes('sports') || category.includes('fitness') || name.includes('dumbbell') || name.includes('racket') || name.includes('yoga mat') || name.includes('football')) {
    return {
      emoji: '🏋️',
      tag: product.brand || 'Sports & Fitness',
      badgeColor: 'from-emerald-600 to-teal-800',
      bgGradient: 'from-emerald-950/80 via-slate-900 to-slate-950',
      textColor: 'text-emerald-300',
      desc: 'Workout Gear & Sports Equipment',
      fallbackImg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600'
    };
  }

  // 12. Grocery & Daily Essentials
  if (category.includes('grocery') || category.includes('daily') || name.includes('oil') || name.includes('tea') || name.includes('rice') || name.includes('chocolate')) {
    return {
      emoji: '🛒',
      tag: product.brand || 'Grocery & Daily Essentials',
      badgeColor: 'from-lime-600 to-green-800',
      bgGradient: 'from-lime-950/80 via-slate-900 to-slate-950',
      textColor: 'text-lime-300',
      desc: 'Fresh Groceries & Pantry Essentials',
      fallbackImg: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600'
    };
  }

  // 13. Jewellery & Accessories
  if (category.includes('jewellery') || category.includes('accessories') || name.includes('necklace') || name.includes('ring') || name.includes('sunglasses') || name.includes('fossil')) {
    return {
      emoji: '💍',
      tag: product.brand || 'Jewellery & Accessories',
      badgeColor: 'from-violet-600 to-fuchsia-800',
      bgGradient: 'from-violet-950/80 via-slate-900 to-slate-950',
      textColor: 'text-violet-300',
      desc: 'Fine Silver Jewellery & Fashion Accessories',
      fallbackImg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600'
    };
  }

  // 14. Automotive
  if (category.includes('automotive') || name.includes('car') || name.includes('compressor') || name.includes('dash cam') || name.includes('polish')) {
    return {
      emoji: '🚗',
      tag: product.brand || 'Automotive',
      badgeColor: 'from-blue-700 to-slate-900',
      bgGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
      textColor: 'text-blue-300',
      desc: 'Car Accessories & Vehicle Care Tools',
      fallbackImg: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600'
    };
  }

  // 15. Pet Supplies
  if (category.includes('pet') || name.includes('dog') || name.includes('cat') || name.includes('royal canin') || name.includes('whiskas')) {
    return {
      emoji: '🐶',
      tag: product.brand || 'Pet Supplies',
      badgeColor: 'from-orange-500 to-amber-700',
      bgGradient: 'from-orange-950/80 via-slate-900 to-slate-950',
      textColor: 'text-orange-300',
      desc: 'Nutritional Food & Premium Pet Products',
      fallbackImg: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600'
    };
  }

  // 16. Tools & Home Improvement
  if (category.includes('tools') || category.includes('home improvement') || name.includes('drill') || name.includes('tool set') || name.includes('spanner') || name.includes('surge protector')) {
    return {
      emoji: '🔧',
      tag: product.brand || 'Tools & Home Improvement',
      badgeColor: 'from-slate-600 to-zinc-800',
      bgGradient: 'from-slate-900 via-slate-900 to-slate-950',
      textColor: 'text-zinc-300',
      desc: 'Hardware Tools & Electrical Equipment',
      fallbackImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600'
    };
  }

  // 17. Gaming
  if (category.includes('gaming') || name.includes('playstation') || name.includes('nintendo') || name.includes('mouse') || name.includes('dualsense') || name.includes('ps5')) {
    return {
      emoji: '🎮',
      tag: product.brand || 'Gaming',
      badgeColor: 'from-indigo-600 to-purple-800',
      bgGradient: 'from-indigo-950/80 via-slate-900 to-slate-950',
      textColor: 'text-indigo-300',
      desc: 'Gaming Consoles, Peripherals & Controllers',
      fallbackImg: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600'
    };
  }

  // 18. TV & Appliances
  if (category.includes('tv') || category.includes('appliances') || name.includes('television') || name.includes('refrigerator') || name.includes('washing machine') || name.includes('ac')) {
    return {
      emoji: '📺',
      tag: product.brand || 'TV & Appliances',
      badgeColor: 'from-sky-700 to-indigo-900',
      bgGradient: 'from-sky-950/80 via-slate-900 to-slate-950',
      textColor: 'text-sky-300',
      desc: '4K Smart TVs & Heavy Home Appliances',
      fallbackImg: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=600'
    };
  }

  // 19. Travel & Luggage
  if (category.includes('travel') || category.includes('luggage') || name.includes('trolley') || name.includes('suitcase') || name.includes('backpack') || name.includes('tourister')) {
    return {
      emoji: '🧳',
      tag: product.brand || 'Travel & Luggage',
      badgeColor: 'from-cyan-700 to-teal-900',
      bgGradient: 'from-cyan-950/80 via-slate-900 to-slate-950',
      textColor: 'text-cyan-300',
      desc: 'Durable Travel Bags & Suitcases',
      fallbackImg: 'https://images.unsplash.com/photo-1565026057447-b88e40e68e8b?q=80&w=600'
    };
  }

  // 20. Gifts & Others
  if (category.includes('gift') || name.includes('chocolate') || name.includes('echo dot') || name.includes('photo frame') || name.includes('toothbrush')) {
    return {
      emoji: '🎁',
      tag: product.brand || 'Gifts & Others',
      badgeColor: 'from-pink-600 to-purple-800',
      bgGradient: 'from-pink-950/80 via-slate-900 to-slate-950',
      textColor: 'text-pink-300',
      desc: 'Thoughtful Gifts & Lifestyle Novelties',
      fallbackImg: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=600'
    };
  }

  // Default
  return {
    emoji: '📦',
    tag: product.brand || 'Product',
    badgeColor: 'from-slate-700 to-slate-900',
    bgGradient: 'from-slate-900 via-slate-900 to-slate-950',
    textColor: 'text-slate-300',
    desc: 'Verified E-Commerce Deal',
    fallbackImg: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600'
  };
}

export function getReliableProductImage(product = {}) {
  const name = (product.name || '').toLowerCase();

  // ── Product-specific overrides (checked first, by product name keyword) ──
  // These ensure each product shows the correct image regardless of DB value
  if (name.includes('portronics') || name.includes('power bank'))
    return 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=600';
  if (name.includes('boat airdopes') || name.includes('airdopes alpha'))
    return 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600';
  if (name.includes('apple airpods') || name.includes('airpods pro'))
    return 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600';
  if (name.includes('sony wh') || name.includes('noise cancelling headphone'))
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600';
  if (name.includes('jbl flip') || name.includes('bluetooth speaker'))
    return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600';
  if (name.includes('k8 wireless lavalier') || name.includes('lavalier microphone'))
    return 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600';
  if (name.includes('samsung galaxy s24') || name.includes('galaxy s24'))
    return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600';
  if (name.includes('oneplus 12'))
    return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600';
  if (name.includes('google pixel 8'))
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600';
  if (name.includes('apple ipad air') || name.includes('ipad air m2'))
    return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600';
  if (name.includes('www.flipkart') || name.includes('flipkart.com'))
    return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600';
  if (name.includes('apple watch series 9'))
    return 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600';
  if (name.includes('samsung galaxy watch'))
    return 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600';
  if (name.includes('hp pavilion') || name.includes('hp laptop'))
    return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600';
  if (name.includes('lenovo legion'))
    return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600';
  if (name.includes('macbook air m3') || name.includes('macbook air'))
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600';
  if (name.includes('macbook pro m4') || name.includes('macbook pro'))
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600';
  if (name.includes('dell xps'))
    return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600';
  if (name.includes('pears pure') || name.includes('bathing bar'))
    return 'https://images.unsplash.com/photo-1607006411601-775c8cc632dc?q=80&w=600';
  if (name.includes('santoor') || name.includes('turmeric bathing'))
    return 'https://images.unsplash.com/photo-1607006314144-8869165d491f?q=80&w=600';
  if (name.includes('tresemme') || name.includes('anti-frizz hair shampoo'))
    return 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600';
  if (name.includes('fogg scent') || name.includes('eau de parfum'))
    return 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600';
  if (name.includes('medimix') || name.includes('ayurvedic'))
    return 'https://images.unsplash.com/photo-1607006483702-326002f23b12?q=80&w=600';
  if (name.includes('dettol') || name.includes('germ protection'))
    return 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=600';
  if (name.includes('dove cream') || name.includes('dove') && name.includes('soap'))
    return 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600';
  if (name.includes('nike air zoom') || name.includes('nike') && name.includes('running'))
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600';
  if (name.includes('adidas ultraboost') || name.includes('ultraboost'))
    return 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600';
  if (name.includes('crocs classic') || name.includes('crocs'))
    return 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600';
  if (name.includes("levi's") || name.includes('slim fit') && name.includes('jeans'))
    return 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=600';
  if (name.includes('kurti') || name.includes('rayon kurti'))
    return 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600';
  if (name.includes('puma classic') || name.includes('fleece pullover hoodie'))
    return 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600';
  if (name.includes('ray-ban aviator') || name.includes('aviator') && name.includes('sunglasses'))
    return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600';
  if (name.includes('prestige induction') || name.includes('induction cooktop'))
    return 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600';
  if (name.includes('philips') && name.includes('air fryer'))
    return 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=600';
  if (name.includes('tata tea') || name.includes('royal assam'))
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600';
  if (name.includes('daawat') || name.includes('basmati rice'))
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600';
  if (name.includes('fortune sunlite') || name.includes('sunflower') && name.includes('oil'))
    return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600';

  // ── If DB has a valid imageUrl, use it ──
  if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim()) {
    return product.imageUrl;
  }

  // ── Category-based fallback ──
  const visual = getProductVisual(product);
  return visual.fallbackImg || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600';
}
