import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputFile = path.join(__dirname, '../data/mockProducts.js');

const MARKETPLACE_URLS = {
  Amazon: 'https://www.amazon.in',
  Flipkart: 'https://www.flipkart.com',
  Meesho: 'https://www.meesho.com',
  Blinkit: 'https://www.blinkit.com',
  Zepto: 'https://www.zeptonow.com',
  'Swiggy Instamart': 'https://www.swiggy.com/instamart',
  BigBasket: 'https://www.bigbasket.com',
  JioMart: 'https://www.jiomart.com',
};

// Group 1: 50 Snacks & Beverages (25 snacks, 25 beverages)
const snacksList = [
  { name: "Lay's Classic Salted Chips", brand: "Lay's", subcategory: "Chips", quantity: 90, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600" },
  { name: "Kurkure Masala Munch", brand: "Kurkure", subcategory: "Chips", quantity: 90, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?q=80&w=600" },
  { name: "Bingo Mad Angles Cheese Nachos", brand: "Bingo", subcategory: "Chips", quantity: 80, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600" },
  { name: "Haldiram's Aloo Bhujia", brand: "Haldiram's", subcategory: "Namkeen", quantity: 200, unit: "g", price: 55, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600" },
  { name: "Britannia Treat Chocolate Creme Cookies", brand: "Britannia", subcategory: "Biscuits", quantity: 120, unit: "g", price: 30, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Oreo Original Chocolate Sandwich Biscuits", brand: "Oreo", subcategory: "Cookies", quantity: 120, unit: "g", price: 35, img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600" },
  { name: "Sunfeast Dark Fantasy Choco Fills", brand: "Sunfeast", subcategory: "Cookies", quantity: 75, unit: "g", price: 40, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Too Yumm! Karare Munch Chips", brand: "Too Yumm!", subcategory: "Chips", quantity: 75, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600" },
  { name: "Doritos Nacho Cheese Tortilla Chips", brand: "Doritos", subcategory: "Chips", quantity: 100, unit: "g", price: 50, img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600" },
  { name: "Pringles Sour Cream & Onion", brand: "Pringles", subcategory: "Chips", quantity: 107, unit: "g", price: 110, img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600" },
  { name: "Parle-G Gold Biscuits", brand: "Parle", subcategory: "Biscuits", quantity: 250, unit: "g", price: 25, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Good Day Cashew Cookies", brand: "Britannia", subcategory: "Cookies", quantity: 200, unit: "g", price: 45, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Hide & Seek Chocolate Chip Biscuits", brand: "Parle", subcategory: "Cookies", quantity: 100, unit: "g", price: 30, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Haldiram's Bhujia Sev", brand: "Haldiram's", subcategory: "Namkeen", quantity: 150, unit: "g", price: 45, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600" },
  { name: "Bikaji Aslee Bikaneri Bhujia", brand: "Bikaji", subcategory: "Namkeen", quantity: 200, unit: "g", price: 60, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600" },
  { name: "Cadbury Dairy Milk Silk Chocolate", brand: "Cadbury", subcategory: "Chocolate", quantity: 60, unit: "g", price: 80, img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600" },
  { name: "Nestle KitKat 4 Finger Chocolate", brand: "Nestle", subcategory: "Chocolate", quantity: 38, unit: "g", price: 30, img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600" },
  { name: "Amul Dark Chocolate (55% Cocoa)", brand: "Amul", subcategory: "Chocolate", quantity: 150, unit: "g", price: 110, img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600" },
  { name: "Act II Golden Sizzle Instant Popcorn", brand: "Act II", subcategory: "Popcorn", quantity: 60, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=600" },
  { name: "Maggi 2-Minute Masala Noodles", brand: "Maggi", subcategory: "Instant Noodles", quantity: 280, unit: "g", price: 56, img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600" },
  { name: "Yippee! Magic Masala Noodles", brand: "Sunfeast", subcategory: "Instant Noodles", quantity: 240, unit: "g", price: 48, img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600" },
  { name: "Haldiram's Soan Papdi", brand: "Haldiram's", subcategory: "Candy", quantity: 250, unit: "g", price: 90, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600" },
  { name: "Ferrero Rocher Chocolate Box (8 Pcs)", brand: "Ferrero", subcategory: "Chocolate", quantity: 100, unit: "g", price: 349, img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600" },
  { name: "Lotte Choco Pie (Pack of 6)", brand: "Lotte", subcategory: "Cookies", quantity: 168, unit: "g", price: 90, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Alpenliebe Gold Caramel Candies", brand: "Alpenliebe", subcategory: "Candy", quantity: 150, unit: "g", price: 50, img: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=600" },
];

const beveragesList = [
  { name: "Coca-Cola Soft Drink Can", brand: "Coca-Cola", subcategory: "Soft Drinks", quantity: 300, unit: "ml", price: 40, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600" },
  { name: "Pepsi Soft Drink PET Bottle", brand: "Pepsi", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=600" },
  { name: "Sprite Lemon-Lime Soft Drink", brand: "Sprite", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=600" },
  { name: "Fanta Orange Soft Drink", brand: "Fanta", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=600" },
  { name: "Thums Up Soft Drink Bottle", brand: "Thums Up", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600" },
  { name: "Maaza Mango Drink PET Bottle", brand: "Maaza", subcategory: "Fruit Juice", quantity: 600, unit: "ml", price: 42, img: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=600" },
  { name: "Real Fruit Power Orange Juice", brand: "Real", subcategory: "Fruit Juice", quantity: 1, unit: "L", price: 120, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600" },
  { name: "Tropicana 100% Mixed Fruit Juice", brand: "Tropicana", subcategory: "Fruit Juice", quantity: 1, unit: "L", price: 135, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600" },
  { name: "Monster Energy Drink Can", brand: "Monster", subcategory: "Energy Drinks", quantity: 350, unit: "ml", price: 125, img: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=600" },
  { name: "Red Bull Energy Drink Can", brand: "Red Bull", subcategory: "Energy Drinks", quantity: 250, unit: "ml", price: 125, img: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=600" },
  { name: "Sting Energy Drink Bottle", brand: "Sting", subcategory: "Energy Drinks", quantity: 250, unit: "ml", price: 20, img: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=600" },
  { name: "Amul Kool Chocolate Milkshake", brand: "Amul", subcategory: "Milkshakes", quantity: 200, unit: "ml", price: 35, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600" },
  { name: "Cavins Chocolate Milkshake", brand: "Cavins", subcategory: "Milkshakes", quantity: 200, unit: "ml", price: 40, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600" },
  { name: "Kinley Packaged Drinking Water", brand: "Kinley", subcategory: "Water", quantity: 1, unit: "L", price: 20, img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=600" },
  { name: "Bisleri Mineral Water Bottle", brand: "Bisleri", subcategory: "Water", quantity: 1, unit: "L", price: 20, img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=600" },
  { name: "Tata Tea Gold Leaf Tea", brand: "Tata", subcategory: "Tea", quantity: 500, unit: "g", price: 310, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600" },
  { name: "Red Label Natural Care Tea", brand: "Brooke Bond", subcategory: "Tea", quantity: 500, unit: "g", price: 340, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600" },
  { name: "Nescafe Classic Instant Coffee", brand: "Nescafe", subcategory: "Coffee", quantity: 100, unit: "g", price: 320, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600" },
  { name: "Bru Instant Coffee Powder", brand: "Bru", subcategory: "Coffee", quantity: 100, unit: "g", price: 210, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600" },
  { name: "Gatorade Blue Bolt Sports Drink", brand: "Gatorade", subcategory: "Sports Drinks", quantity: 500, unit: "ml", price: 50, img: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=600" },
  { name: "Paper Boat Aamras Mango Fruit Juice", brand: "Paper Boat", subcategory: "Fruit Juice", quantity: 200, unit: "ml", price: 35, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600" },
  { name: "B-Natural Mixed Fruit Juice", brand: "ITC", subcategory: "Fruit Juice", quantity: 1, unit: "L", price: 115, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600" },
  { name: "Appy Fizz Sparkling Apple Juice", brand: "Parle Agro", subcategory: "Soft Drinks", quantity: 600, unit: "ml", price: 38, img: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=600" },
  { name: "7UP Lemon Soda PET Bottle", brand: "7UP", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=600" },
  { name: "Bournvita Chocolate Health Drink", brand: "Cadbury", subcategory: "Milkshakes", quantity: 500, unit: "g", price: 245, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600" },
];

console.log(`Snacks count: ${snacksList.length}, Beverages count: ${beveragesList.length}`);
