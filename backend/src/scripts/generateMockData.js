import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMarketplaceBuyUrl } from '../utils/marketplaceUrl.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Grocery / Snacks / Beverages / Departmental marketplaces
const GROCERY_MARKETPLACES = ['Blinkit', 'Zepto', 'Swiggy Instamart', 'BigBasket', 'JioMart'];
// Electronics marketplaces
const ELECTRONICS_MARKETPLACES = ['Amazon', 'Flipkart', 'Meesho'];
// Dress / Fashion marketplaces
const FASHION_MARKETPLACES = ['Amazon', 'Flipkart', 'Meesho'];

// GROUP 1: 50 Snacks & Beverages (25 snacks, 25 beverages)
const group1Raw = [
  // 25 Snacks
  { name: "Lay's Classic Salted Chips", brand: "Lay's", subcategory: "Chips", quantity: 90, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600" },
  { name: "Kurkure Masala Munch", brand: "Kurkure", subcategory: "Chips", quantity: 90, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?q=80&w=600" },
  { name: "Bingo Mad Angles Cheese Nachos", brand: "Bingo", subcategory: "Chips", quantity: 80, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=600" },
  { name: "Haldiram's Aloo Bhujia", brand: "Haldiram's", subcategory: "Namkeen", quantity: 200, unit: "g", price: 55, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600" },
  { name: "Britannia Treat Chocolate Creme Cookies", brand: "Britannia", subcategory: "Biscuits", quantity: 120, unit: "g", price: 30, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Oreo Original Chocolate Sandwich Biscuits", brand: "Oreo", subcategory: "Cookies", quantity: 120, unit: "g", price: 35, img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600" },
  { name: "Sunfeast Dark Fantasy Choco Fills", brand: "Sunfeast", subcategory: "Cookies", quantity: 75, unit: "g", price: 40, img: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=600" },
  { name: "Too Yumm! Karare Munch Chips", brand: "Too Yumm!", subcategory: "Chips", quantity: 75, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?q=80&w=600" },
  { name: "Doritos Nacho Cheese Tortilla Chips", brand: "Doritos", subcategory: "Chips", quantity: 100, unit: "g", price: 50, img: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=600" },
  { name: "Pringles Sour Cream & Onion", brand: "Pringles", subcategory: "Chips", quantity: 107, unit: "g", price: 110, img: "https://images.unsplash.com/photo-1527844063518-3dd6f0f59c6b?q=80&w=600" },
  { name: "Parle-G Gold Biscuits", brand: "Parle", subcategory: "Biscuits", quantity: 250, unit: "g", price: 25, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600" },
  { name: "Good Day Cashew Cookies", brand: "Britannia", subcategory: "Cookies", quantity: 200, unit: "g", price: 45, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Hide & Seek Chocolate Chip Biscuits", brand: "Parle", subcategory: "Cookies", quantity: 100, unit: "g", price: 30, img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600" },
  { name: "Haldiram's Bhujia Sev", brand: "Haldiram's", subcategory: "Namkeen", quantity: 150, unit: "g", price: 45, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600" },
  { name: "Bikaji Aslee Bikaneri Bhujia", brand: "Bikaji", subcategory: "Namkeen", quantity: 200, unit: "g", price: 60, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600" },
  { name: "Cadbury Dairy Milk Silk Chocolate", brand: "Cadbury", subcategory: "Chocolate", quantity: 60, unit: "g", price: 80, img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600" },
  { name: "Nestle KitKat 4 Finger Chocolate", brand: "Nestle", subcategory: "Chocolate", quantity: 38, unit: "g", price: 30, img: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=600" },
  { name: "Amul Dark Chocolate (55% Cocoa)", brand: "Amul", subcategory: "Chocolate", quantity: 150, unit: "g", price: 110, img: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=600" },
  { name: "Act II Golden Sizzle Instant Popcorn", brand: "Act II", subcategory: "Popcorn", quantity: 60, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=600" },
  { name: "Maggi 2-Minute Masala Noodles", brand: "Maggi", subcategory: "Instant Noodles", quantity: 280, unit: "g", price: 56, img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600" },
  { name: "Yippee! Magic Masala Noodles", brand: "Sunfeast", subcategory: "Instant Noodles", quantity: 240, unit: "g", price: 48, img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600" },
  { name: "Haldiram's Soan Papdi", brand: "Haldiram's", subcategory: "Candy", quantity: 250, unit: "g", price: 90, img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600" },
  { name: "Ferrero Rocher Chocolate Box (8 Pcs)", brand: "Ferrero", subcategory: "Chocolate", quantity: 100, unit: "g", price: 349, img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600" },
  { name: "Lotte Choco Pie (Pack of 6)", brand: "Lotte", subcategory: "Cookies", quantity: 168, unit: "g", price: 90, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600" },
  { name: "Alpenliebe Gold Caramel Candies", brand: "Alpenliebe", subcategory: "Candy", quantity: 150, unit: "g", price: 50, img: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=600" },

  // 25 Beverages
  { name: "Coca-Cola Soft Drink Can", brand: "Coca-Cola", subcategory: "Soft Drinks", quantity: 300, unit: "ml", price: 40, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600" },
  { name: "Pepsi Soft Drink PET Bottle", brand: "Pepsi", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=600" },
  { name: "Sprite Lemon-Lime Soft Drink", brand: "Sprite", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=600" },
  { name: "Fanta Orange Soft Drink", brand: "Fanta", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=600" },
  { name: "Thums Up Soft Drink Bottle", brand: "Thums Up", subcategory: "Soft Drinks", quantity: 750, unit: "ml", price: 45, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600" },
  { name: "Maaza Mango Drink PET Bottle", brand: "Maaza", subcategory: "Fruit Juice", quantity: 600, unit: "ml", price: 42, img: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=600" },
  { name: "Real Fruit Power Orange Juice", brand: "Real", subcategory: "Fruit Juice", quantity: 1, unit: "L", price: 120, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600" },
  { name: "Tropicana 100% Mixed Fruit Juice", brand: "Tropicana", subcategory: "Fruit Juice", quantity: 1, unit: "L", price: 135, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600" },
  { name: "Monster Energy Drink Can", brand: "Monster", subcategory: "Energy Drinks", quantity: 350, unit: "ml", price: 125, img: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=600" },
  { name: "Red Bull Energy Drink Can", brand: "Red Bull", subcategory: "Energy Drinks", quantity: 250, unit: "ml", price: 125, img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600" },
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

// GROUP 2: 50 Grocery Items
const group2Raw = [
  { name: "Fresh Banana (Robusta)", brand: "Fresh", subcategory: "Fruits", quantity: 1, unit: "kg", price: 45, img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600" },
  { name: "Shimla Apple Crisp", brand: "Fresh", subcategory: "Fruits", quantity: 1, unit: "kg", price: 140, img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600" },
  { name: "Nagpur Oranges", brand: "Fresh", subcategory: "Fruits", quantity: 1, unit: "kg", price: 80, img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=600" },
  { name: "Alphonso Mangoes", brand: "Fresh", subcategory: "Fruits", quantity: 1, unit: "kg", price: 350, img: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600" },
  { name: "Fresh Red Tomato", brand: "Fresh", subcategory: "Vegetables", quantity: 1, unit: "kg", price: 30, img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600" },
  { name: "Fresh Potato (Jyoti)", brand: "Fresh", subcategory: "Vegetables", quantity: 1, unit: "kg", price: 25, img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600" },
  { name: "Fresh Red Onion", brand: "Fresh", subcategory: "Vegetables", quantity: 1, unit: "kg", price: 35, img: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=600" },
  { name: "Fresh Orange Carrot", brand: "Fresh", subcategory: "Vegetables", quantity: 500, unit: "g", price: 25, img: "https://images.unsplash.com/photo-1598170845058-12ef4a45753b?q=80&w=600" },
  { name: "Amul Taaza Toned Milk", brand: "Amul", subcategory: "Milk", quantity: 500, unit: "ml", price: 27, img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600" },
  { name: "Amul Gold Full Cream Milk", brand: "Amul", subcategory: "Milk", quantity: 1, unit: "L", price: 66, img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600" },
  { name: "Aavin Toned Milk", brand: "Aavin", subcategory: "Milk", quantity: 500, unit: "ml", price: 24, img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600" },
  { name: "Nandini Toned Milk", brand: "Nandini", subcategory: "Milk", quantity: 1, unit: "L", price: 42, img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600" },
  { name: "Mother Dairy Toned Milk", brand: "Mother Dairy", subcategory: "Milk", quantity: 1, unit: "L", price: 54, img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600" },
  { name: "Fresh Farm White Eggs (6 Pcs)", brand: "Farm Fresh", subcategory: "Eggs", quantity: 6, unit: "pieces", price: 42, img: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?q=80&w=600" },
  { name: "Fresh Farm White Eggs (12 Pcs)", brand: "Farm Fresh", subcategory: "Eggs", quantity: 12, unit: "pieces", price: 80, img: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?q=80&w=600" },
  { name: "India Gate Super Basmati Rice", brand: "India Gate", subcategory: "Rice", quantity: 1, unit: "kg", price: 160, img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600" },
  { name: "Fortune Rozana Basmati Rice", brand: "Fortune", subcategory: "Rice", quantity: 5, unit: "kg", price: 450, img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600" },
  { name: "Aashirvaad Shuddh Chakki Atta", brand: "Aashirvaad", subcategory: "Atta", quantity: 5, unit: "kg", price: 235, img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600" },
  { name: "Fortune Chakki Fresh Atta", brand: "Fortune", subcategory: "Atta", quantity: 5, unit: "kg", price: 215, img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600" },
  { name: "Tata Salt Vacuum Evaporated", brand: "Tata", subcategory: "Salt", quantity: 1, unit: "kg", price: 28, img: "https://images.unsplash.com/photo-1518110168401-f2877ee2c6ad?q=80&w=600" },
  { name: "Aashirvaad Iodised Salt", brand: "Aashirvaad", subcategory: "Salt", quantity: 1, unit: "kg", price: 24, img: "https://images.unsplash.com/photo-1518110168401-f2877ee2c6ad?q=80&w=600" },
  { name: "Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch)", brand: "Fortune", subcategory: "Oil", quantity: 1, unit: "L", price: 135, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600" },
  { name: "Saffola Gold Multisource Edible Oil", brand: "Saffola", subcategory: "Oil", quantity: 1, unit: "L", price: 165, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600" },
  { name: "Dhara Mustard Oil", brand: "Dhara", subcategory: "Oil", quantity: 1, unit: "L", price: 155, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600" },
  { name: "Tata Sampann Unpolished Toor Dal", brand: "Tata Sampann", subcategory: "Dal", quantity: 1, unit: "kg", price: 165, img: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=600" },
  { name: "Tata Sampann Unpolished Moong Dal", brand: "Tata Sampann", subcategory: "Dal", quantity: 1, unit: "kg", price: 140, img: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=600" },
  { name: "Tata Sampann Unpolished Chana Dal", brand: "Tata Sampann", subcategory: "Dal", quantity: 1, unit: "kg", price: 110, img: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=600" },
  { name: "Madhur Pure & Hygienic Sugar", brand: "Madhur", subcategory: "Sugar", quantity: 1, unit: "kg", price: 55, img: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?q=80&w=600" },
  { name: "Trust Classic Sulphate Free Sugar", brand: "Trust", subcategory: "Sugar", quantity: 1, unit: "kg", price: 60, img: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?q=80&w=600" },
  { name: "Catch Red Chilli Powder", brand: "Catch", subcategory: "Spices", quantity: 200, unit: "g", price: 75, img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600" },
  { name: "MDH Turmeric Powder (Haldi)", brand: "MDH", subcategory: "Spices", quantity: 200, unit: "g", price: 65, img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600" },
  { name: "Everest Coriander Powder (Dhania)", brand: "Everest", subcategory: "Spices", quantity: 200, unit: "g", price: 60, img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600" },
  { name: "Quaker Rolled Oats", brand: "Quaker", subcategory: "Breakfast items", quantity: 1, unit: "kg", price: 190, img: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=600" },
  { name: "Kellogg's Corn Flakes Original", brand: "Kellogg's", subcategory: "Breakfast items", quantity: 475, unit: "g", price: 215, img: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?q=80&w=600" },
  { name: "Saffola Masala Oats Classic", brand: "Saffola", subcategory: "Breakfast items", quantity: 500, unit: "g", price: 185, img: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=600" },
  { name: "Fresh Green Capsicum", brand: "Fresh", subcategory: "Vegetables", quantity: 500, unit: "g", price: 35, img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=600" },
  { name: "Fresh Cauliflower", brand: "Fresh", subcategory: "Vegetables", quantity: 1, unit: "piece", price: 30, img: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?q=80&w=600" },
  { name: "Fresh Green Cucumber", brand: "Fresh", subcategory: "Vegetables", quantity: 500, unit: "g", price: 20, img: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?q=80&w=600" },
  { name: "Fresh Pomegranate (Anar)", brand: "Fresh", subcategory: "Fruits", quantity: 1, unit: "kg", price: 180, img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600" },
  { name: "Fresh Papaya Semi-Ripe", brand: "Fresh", subcategory: "Fruits", quantity: 1, unit: "kg", price: 50, img: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=600" },
  { name: "Milky Mist Paneer Fresh", brand: "Milky Mist", subcategory: "Cooking essentials", quantity: 200, unit: "g", price: 95, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600" },
  { name: "Amul Masti Dahi (400g)", brand: "Amul", subcategory: "Cooking essentials", quantity: 400, unit: "g", price: 35, img: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?q=80&w=600" },
  { name: "Amul Pasteurised Butter", brand: "Amul", subcategory: "Cooking essentials", quantity: 100, unit: "g", price: 56, img: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=600" },
  { name: "Amul Processed Cheese Slices", brand: "Amul", subcategory: "Cooking essentials", quantity: 200, unit: "g", price: 140, img: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=600" },
  { name: "Catch Ginger Garlic Paste", brand: "Catch", subcategory: "Cooking essentials", quantity: 200, unit: "g", price: 50, img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600" },
  { name: "Kissan Tomato Ketchup Fresh", brand: "Kissan", subcategory: "Packaged foods", quantity: 950, unit: "g", price: 130, img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600" },
  { name: "Maggi Hot & Sweet Chilli Sauce", brand: "Maggi", subcategory: "Packaged foods", quantity: 500, unit: "g", price: 110, img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600" },
  { name: "Sundrop Peanut Butter Crunchy", brand: "Sundrop", subcategory: "Packaged foods", quantity: 500, unit: "g", price: 175, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600" },
  { name: "Nutella Hazelnut Spread", brand: "Nutella", subcategory: "Packaged foods", quantity: 350, unit: "g", price: 380, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600" },
  { name: "MTR Ready to Eat Paneer Butter Masala", brand: "MTR", subcategory: "Packaged foods", quantity: 300, unit: "g", price: 115, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600" },
];

// GROUP 3: 50 Electronics (25 Mobiles, 25 Laptops)
const group3Raw = [
  // 25 Mobiles
  { name: "Samsung Galaxy A55 5G (8GB RAM, 128GB)", brand: "Samsung", subcategory: "Mobiles", price: 36999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Exynos 1480", display: '6.6" AMOLED', battery: "5000mAh", camera: "50MP", is5G: true } },
  { name: "Samsung Galaxy A35 5G (8GB RAM, 128GB)", brand: "Samsung", subcategory: "Mobiles", price: 27999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Exynos 1380", display: '6.6" Super AMOLED', battery: "5000mAh", camera: "50MP", is5G: true } },
  { name: "Samsung Galaxy S24 5G (8GB RAM, 256GB)", brand: "Samsung", subcategory: "Mobiles", price: 64999, img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600", specs: { ram: "8GB", storage: "256GB", processor: "Snapdragon 8 Gen 3", display: '6.2" Dynamic AMOLED', battery: "4000mAh", camera: "50MP Triple", is5G: true } },
  { name: "Redmi Note 13 Pro 5G (8GB RAM, 256GB)", brand: "Redmi", subcategory: "Mobiles", price: 23999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "8GB", storage: "256GB", processor: "Snapdragon 7s Gen 2", display: '6.67" AMOLED 120Hz', battery: "5100mAh", camera: "200MP OIS", is5G: true } },
  { name: "Redmi Note 13 5G (6GB RAM, 128GB)", brand: "Redmi", subcategory: "Mobiles", price: 16999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "6GB", storage: "128GB", processor: "Dimensity 6080", display: '6.67" FHD+ AMOLED', battery: "5000mAh", camera: "108MP", is5G: true } },
  { name: "Redmi 13C 5G (4GB RAM, 128GB)", brand: "Redmi", subcategory: "Mobiles", price: 10499, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "4GB", storage: "128GB", processor: "Dimensity 6100+", display: '6.74" 90Hz', battery: "5000mAh", camera: "50MP AI", is5G: true } },
  { name: "Realme 12 Pro+ 5G (8GB RAM, 256GB)", brand: "Realme", subcategory: "Mobiles", price: 29999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", specs: { ram: "8GB", storage: "256GB", processor: "Snapdragon 7s Gen 2", display: '6.7" OLED Periscope', battery: "5000mAh", camera: "64MP Periscope", is5G: true } },
  { name: "Realme Narzo 70 Pro 5G (8GB RAM, 128GB)", brand: "Realme", subcategory: "Mobiles", price: 18999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Dimensity 7050", display: '6.67" AMOLED', battery: "5000mAh", camera: "50MP Sony IMX890", is5G: true } },
  { name: "Realme C65 5G (6GB RAM, 128GB)", brand: "Realme", subcategory: "Mobiles", price: 11499, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", specs: { ram: "6GB", storage: "128GB", processor: "Dimensity 6300", display: '6.67" 120Hz', battery: "5000mAh", camera: "50MP", is5G: true } },
  { name: "OnePlus Nord CE 4 5G (8GB RAM, 128GB)", brand: "OnePlus", subcategory: "Mobiles", price: 24999, img: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Snapdragon 7 Gen 3", display: '6.7" AMOLED 120Hz', battery: "5500mAh", camera: "50MP Sony LYT600", is5G: true } },
  { name: "OnePlus Nord 4 5G (8GB RAM, 256GB)", brand: "OnePlus", subcategory: "Mobiles", price: 29999, img: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=600", specs: { ram: "8GB", storage: "256GB", processor: "Snapdragon 7+ Gen 3", display: '6.74" 1.5K AMOLED', battery: "5500mAh", camera: "50MP OIS", is5G: true } },
  { name: "OnePlus 12R 5G (8GB RAM, 128GB)", brand: "OnePlus", subcategory: "Mobiles", price: 39999, img: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Snapdragon 8 Gen 2", display: '6.78" LTPO4 AMOLED', battery: "5500mAh", camera: "50MP Sony IMX890", is5G: true } },
  { name: "Vivo V30 5G (8GB RAM, 128GB)", brand: "Vivo", subcategory: "Mobiles", price: 33999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Snapdragon 7 Gen 3", display: '6.78" 3D Curved AMOLED', battery: "5000mAh", camera: "50MP Aura Light", is5G: true } },
  { name: "Vivo T3 5G (8GB RAM, 128GB)", brand: "Vivo", subcategory: "Mobiles", price: 19999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Dimensity 7200", display: '6.67" AMOLED 120Hz', battery: "5000mAh", camera: "50MP Sony OIS", is5G: true } },
  { name: "Vivo Y200e 5G (6GB RAM, 128GB)", brand: "Vivo", subcategory: "Mobiles", price: 17999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "6GB", storage: "128GB", processor: "Snapdragon 4 Gen 2", display: '6.67" AMOLED 120Hz', battery: "5000mAh", camera: "50MP HD", is5G: true } },
  { name: "iQOO Z9 5G (8GB RAM, 128GB)", brand: "iQOO", subcategory: "Mobiles", price: 19999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Dimensity 7200", display: '6.67" 120Hz AMOLED', battery: "5000mAh", camera: "50MP Sony IMX882", is5G: true } },
  { name: "iQOO Neo 9 Pro 5G (8GB RAM, 256GB)", brand: "iQOO", subcategory: "Mobiles", price: 34999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", specs: { ram: "8GB", storage: "256GB", processor: "Snapdragon 8 Gen 2", display: '6.78" 144Hz LTPO', battery: "5160mAh", camera: "50MP Sony IMX920", is5G: true } },
  { name: "Motorola Edge 50 Pro 5G (8GB RAM, 256GB)", brand: "Motorola", subcategory: "Mobiles", price: 31999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "8GB", storage: "256GB", processor: "Snapdragon 7 Gen 3", display: '6.7" 144Hz pOLED', battery: "4500mAh", camera: "50MP OIS AI", is5G: true } },
  { name: "Moto G64 5G (8GB RAM, 128GB)", brand: "Motorola", subcategory: "Mobiles", price: 14999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Dimensity 7025", display: '6.5" 120Hz FHD+', battery: "6000mAh", camera: "50MP OIS", is5G: true } },
  { name: "Apple iPhone 15 (128GB)", brand: "Apple", subcategory: "Mobiles", price: 71999, img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600", specs: { ram: "6GB", storage: "128GB", processor: "A16 Bionic", display: '6.1" Super Retina XDR', battery: "3349mAh", camera: "48MP Dual", is5G: true } },
  { name: "Apple iPhone 14 (128GB)", brand: "Apple", subcategory: "Mobiles", price: 58999, img: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=600", specs: { ram: "6GB", storage: "128GB", processor: "A15 Bionic", display: '6.1" OLED', battery: "3279mAh", camera: "12MP Dual", is5G: true } },
  { name: "Poco X6 Pro 5G (8GB RAM, 256GB)", brand: "Poco", subcategory: "Mobiles", price: 25999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", specs: { ram: "8GB", storage: "256GB", processor: "Dimensity 8300 Ultra", display: '6.67" 1.5K AMOLED 120Hz', battery: "5000mAh", camera: "64MP OIS", is5G: true } },
  { name: "Poco M6 Pro 5G (6GB RAM, 128GB)", brand: "Poco", subcategory: "Mobiles", price: 12999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", specs: { ram: "6GB", storage: "128GB", processor: "Snapdragon 4 Gen 2", display: '6.79" 90Hz FHD+', battery: "5000mAh", camera: "50MP Dual", is5G: true } },
  { name: "Nothing Phone (2a) 5G (8GB RAM, 128GB)", brand: "Nothing", subcategory: "Mobiles", price: 23999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", specs: { ram: "8GB", storage: "128GB", processor: "Dimensity 7200 Pro", display: '6.7" Flexible AMOLED', battery: "5000mAh", camera: "50MP Dual", is5G: true } },
  { name: "Honor X9b 5G (8GB RAM, 256GB)", brand: "Honor", subcategory: "Mobiles", price: 25999, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", specs: { ram: "8GB", storage: "256GB", processor: "Snapdragon 6 Gen 1", display: '6.78" Ultra Bounce OLED', battery: "5800mAh", camera: "108MP Motion Sensing", is5G: true } },

  // 25 Laptops
  { name: "Acer Aspire 5 (Intel Core i5-13th Gen, 16GB, 512GB SSD)", brand: "Acer", subcategory: "Laptops", price: 49990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i5-1335U", ram: "16GB DDR4", storage: "512GB NVMe SSD", gpu: "Intel Iris Xe", display: '15.6" FHD IPS', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "Acer Nitro V 15 (AMD Ryzen 5 7535HS, 16GB, 512GB SSD, RTX 3050)", brand: "Acer", subcategory: "Laptops", price: 58990, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600", specs: { processor: "AMD Ryzen 5 7535HS", ram: "16GB DDR5", storage: "512GB SSD", gpu: "NVIDIA RTX 3050 6GB", display: '15.6" FHD 144Hz', refreshRate: "144Hz", os: "Windows 11" } },
  { name: "Acer Swift Go 14 OLED (Intel Core Ultra 5, 16GB, 512GB SSD)", brand: "Acer", subcategory: "Laptops", price: 69990, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", specs: { processor: "Intel Core Ultra 5 125H", ram: "16GB LPDDR5X", storage: "512GB SSD", gpu: "Intel Arc Graphics", display: '14" 2.8K OLED', refreshRate: "90Hz", os: "Windows 11" } },
  { name: "HP Pavilion 15 (Intel Core i5-13th Gen, 16GB, 512GB SSD)", brand: "HP", subcategory: "Laptops", price: 56990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i5-1335U", ram: "16GB DDR4", storage: "512GB SSD", gpu: "Intel Iris Xe", display: '15.6 Inch FHD IPS', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "HP Victus Gaming (Ryzen 5 7535HS, 16GB, 512GB SSD, RTX 2050)", brand: "HP", subcategory: "Laptops", price: 52990, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600", specs: { processor: "AMD Ryzen 5 7535HS", ram: "16GB DDR5", storage: "512GB SSD", gpu: "NVIDIA RTX 2050 4GB", display: '15.6" FHD 144Hz', refreshRate: "144Hz", os: "Windows 11" } },
  { name: "HP 15s (Intel Core i3-12th Gen, 8GB, 512GB SSD)", brand: "HP", subcategory: "Laptops", price: 34990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i3-1215U", ram: "8GB DDR4", storage: "512GB SSD", gpu: "Intel UHD Graphics", display: '15.6" FHD', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "Lenovo IdeaPad Slim 3 (Intel Core i5-13th Gen, 16GB, 512GB SSD)", brand: "Lenovo", subcategory: "Laptops", price: 51990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i5-13420H", ram: "16GB LPDDR5", storage: "512GB SSD", gpu: "Intel Iris Xe", display: '15.6" FHD IPS', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "Lenovo LOQ Gaming (Intel Core i5-12th Gen, 16GB, 512GB SSD, RTX 3050)", brand: "Lenovo", subcategory: "Laptops", price: 61990, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600", specs: { processor: "Intel Core i5-12450H", ram: "16GB DDR5", storage: "512GB SSD", gpu: "NVIDIA RTX 3050 6GB", display: '15.6" FHD 144Hz', refreshRate: "144Hz", os: "Windows 11" } },
  { name: "Lenovo IdeaPad Flex 5 2-in-1 (Ryzen 7 7730U, 16GB, 512GB SSD)", brand: "Lenovo", subcategory: "Laptops", price: 64990, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", specs: { processor: "AMD Ryzen 7 7730U", ram: "16GB LPDDR4x", storage: "512GB SSD", gpu: "AMD Radeon Graphics", display: '14" WUXGA Touch', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "ASUS Vivobook 15 (Intel Core i5-13th Gen, 16GB, 512GB SSD)", brand: "ASUS", subcategory: "Laptops", price: 52990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i5-1335U", ram: "16GB DDR4", storage: "512GB SSD", gpu: "Intel Iris Xe", display: '15.6" FHD', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "ASUS TUF Gaming F15 (Intel Core i5-11th Gen, 16GB, 512GB SSD, RTX 2050)", brand: "ASUS", subcategory: "Laptops", price: 49990, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600", specs: { processor: "Intel Core i5-11400H", ram: "16GB DDR4", storage: "512GB SSD", gpu: "NVIDIA RTX 2050 4GB", display: '15.6" FHD 144Hz', refreshRate: "144Hz", os: "Windows 11" } },
  { name: "ASUS Zenbook 14 OLED (Intel Core Ultra 7, 16GB, 1TB SSD)", brand: "ASUS", subcategory: "Laptops", price: 96990, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", specs: { processor: "Intel Core Ultra 7 155H", ram: "16GB LPDDR5X", storage: "1TB SSD", gpu: "Intel Arc Graphics", display: '14" 3K OLED 120Hz', refreshRate: "120Hz", os: "Windows 11" } },
  { name: "Dell Inspiron 3520 (Intel Core i5-12th Gen, 16GB, 512GB SSD)", brand: "Dell", subcategory: "Laptops", price: 48990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i5-1235U", ram: "16GB DDR4", storage: "512GB SSD", gpu: "Intel Iris Xe", display: '15.6" FHD 120Hz', refreshRate: "120Hz", os: "Windows 11" } },
  { name: "Dell G15 Gaming (Intel Core i5-13th Gen, 16GB, 512GB SSD, RTX 3050)", brand: "Dell", subcategory: "Laptops", price: 67990, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600", specs: { processor: "Intel Core i5-13450HX", ram: "16GB DDR5", storage: "512GB SSD", gpu: "NVIDIA RTX 3050 6GB", display: '15.6" FHD 120Hz', refreshRate: "120Hz", os: "Windows 11" } },
  { name: "Dell Inspiron 5430 (Intel Core i7-13th Gen, 16GB, 1TB SSD)", brand: "Dell", subcategory: "Laptops", price: 79990, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", specs: { processor: "Intel Core i7-1360P", ram: "16GB LPDDR5", storage: "1TB SSD", gpu: "Intel Iris Xe", display: '14.0" FHD+ ComfortView', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "Apple MacBook Air M2 (8GB RAM, 256GB SSD, 13.6-inch)", brand: "Apple", subcategory: "Laptops", price: 89900, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", specs: { processor: "Apple M2 8-Core", ram: "8GB Unified", storage: "256GB SSD", gpu: "10-Core GPU", display: '13.6" Liquid Retina', refreshRate: "60Hz", os: "macOS Sonoma" } },
  { name: "Apple MacBook Air M3 (8GB RAM, 512GB SSD, 13.6-inch)", brand: "Apple", subcategory: "Laptops", price: 114900, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", specs: { processor: "Apple M3 8-Core", ram: "8GB Unified", storage: "512GB SSD", gpu: "10-Core GPU", display: '13.6" Liquid Retina', refreshRate: "60Hz", os: "macOS Sonoma" } },
  { name: "MSI Thin 15 (Intel Core i5-12th Gen, 16GB, 512GB SSD, RTX 3050)", brand: "MSI", subcategory: "Laptops", price: 54990, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600", specs: { processor: "Intel Core i5-12450H", ram: "16GB DDR4", storage: "512GB SSD", gpu: "NVIDIA RTX 3050 4GB", display: '15.6" FHD 144Hz', refreshRate: "144Hz", os: "Windows 11" } },
  { name: "MSI Modern 14 (Intel Core i3-12th Gen, 8GB, 512GB SSD)", brand: "MSI", subcategory: "Laptops", price: 31990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i3-1215U", ram: "8GB DDR4", storage: "512GB SSD", gpu: "Intel UHD Graphics", display: '14" FHD 60Hz', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "Infinix Zero Book Ultra (Intel Core i9-13th Gen, 32GB, 1TB SSD)", brand: "Infinix", subcategory: "Laptops", price: 79990, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", specs: { processor: "Intel Core i9-13900H", ram: "32GB LPDDR5X", storage: "1TB SSD", gpu: "Intel Iris Xe", display: '15.6" FHD 100% sRGB', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "Honor MagicBook X16 2024 (Intel Core i5-12th Gen, 16GB, 512GB SSD)", brand: "Honor", subcategory: "Laptops", price: 44990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i5-12450H", ram: "16GB LPDDR4x", storage: "512GB SSD", gpu: "Intel UHD Graphics", display: '16" FHD IPS', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "Samsung Galaxy Book3 (Intel Core i5-13th Gen, 8GB, 512GB SSD)", brand: "Samsung", subcategory: "Laptops", price: 54990, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", specs: { processor: "Intel Core i5-1335U", ram: "8GB LPDDR4x", storage: "512GB SSD", gpu: "Intel Iris Xe", display: '15.6" FHD Display', refreshRate: "60Hz", os: "Windows 11" } },
  { name: "ASUS ROG Strix G16 (Intel Core i7-13th Gen, 16GB, 1TB SSD, RTX 4060)", brand: "ASUS", subcategory: "Laptops", price: 129990, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600", specs: { processor: "Intel Core i7-13650HX", ram: "16GB DDR5", storage: "1TB SSD", gpu: "NVIDIA RTX 4060 8GB", display: '16" FHD+ 165Hz', refreshRate: "165Hz", os: "Windows 11" } },
  { name: "Acer Predator Helios Neo 16 (Intel Core i7-13th Gen, 16GB, 1TB SSD, RTX 4050)", brand: "Acer", subcategory: "Laptops", price: 104990, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600", specs: { processor: "Intel Core i7-13700HX", ram: "16GB DDR5", storage: "1TB SSD", gpu: "NVIDIA RTX 4050 6GB", display: '16" WUXGA 165Hz', refreshRate: "165Hz", os: "Windows 11" } },
  { name: "Lenovo ThinkPad E16 (Intel Core i5-13th Gen, 16GB, 512GB SSD)", brand: "Lenovo", subcategory: "Laptops", price: 62990, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600", specs: { processor: "Intel Core i5-1335U", ram: "16GB DDR4", storage: "512GB SSD", gpu: "Intel Iris Xe", display: '16" WUXGA IPS', refreshRate: "60Hz", os: "Windows 11 Pro" } },
];

// GROUP 4: 50 Departmental Store / Daily Essentials
const group4Raw = [
  { name: "Cello Butterflow Ball Pen Blue (Pack of 5)", brand: "Cello", subcategory: "Stationery", price: 50, img: "https://images.unsplash.com/photo-1585336261026-6757688719d3?q=80&w=600" },
  { name: "Reynolds Trimax Gel Pen Blue", brand: "Reynolds", subcategory: "Stationery", price: 60, img: "https://images.unsplash.com/photo-1585336261026-6757688719d3?q=80&w=600" },
  { name: "Classmate Single Line Long Notebook (172 Pages)", brand: "Classmate", subcategory: "Stationery", price: 70, img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600" },
  { name: "JK Copier A4 Paper Rim 75 GSM (500 Sheets)", brand: "JK Paper", subcategory: "Stationery", price: 340, img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600" },
  { name: "Apsara Platinum Extra Dark Pencils (Box of 10)", brand: "Apsara", subcategory: "Stationery", price: 80, img: "https://images.unsplash.com/photo-1585336261026-6757688719d3?q=80&w=600" },
  { name: "Camlin Non Dust Erasers (Pack of 20)", brand: "Camlin", subcategory: "Stationery", price: 60, img: "https://images.unsplash.com/photo-1585336261026-6757688719d3?q=80&w=600" },
  { name: "Colgate Strong Teeth Toothpaste", brand: "Colgate", subcategory: "Personal Care", price: 120, img: "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=600" },
  { name: "Sensodyne Rapid Relief Toothpaste", brand: "Sensodyne", subcategory: "Personal Care", price: 210, img: "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=600" },
  { name: "Oral-B Charcoal Soft Toothbrush (Pack of 4)", brand: "Oral-B", subcategory: "Personal Care", price: 150, img: "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=600" },
  { name: "Dove Cream Beauty Bathing Soap (Pack of 3)", brand: "Dove", subcategory: "Personal Care", price: 195, img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600" },
  { name: "Dettol Original Germ Protection Soap (Pack of 4)", brand: "Dettol", subcategory: "Personal Care", price: 170, img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600" },
  { name: "Pears Pure & Gentle Soap (Pack of 3)", brand: "Pears", subcategory: "Personal Care", price: 180, img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600" },
  { name: "Santoor Sandal & Turmeric Soap (Pack of 4)", brand: "Santoor", subcategory: "Personal Care", price: 160, img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600" },
  { name: "Head & Shoulders Smooth & Silky Shampoo", brand: "Head & Shoulders", subcategory: "Personal Care", price: 340, img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600" },
  { name: "Clinic Plus Strong & Long Shampoo", brand: "Clinic Plus", subcategory: "Personal Care", price: 215, img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600" },
  { name: "Tresemme Keratin Smooth Conditioner", brand: "Tresemme", subcategory: "Personal Care", price: 290, img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600" },
  { name: "Surf Excel Easy Wash Detergent Powder", brand: "Surf Excel", subcategory: "Cleaning", price: 160, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600" },
  { name: "Ariel Matic Front Load Detergent Powder", brand: "Ariel", subcategory: "Cleaning", price: 340, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600" },
  { name: "Rin Advanced Detergent Bar (Pack of 4)", brand: "Rin", subcategory: "Cleaning", price: 60, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600" },
  { name: "Vim Dishwash Gel Lemon Liquid", brand: "Vim", subcategory: "Dishwash", price: 190, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600" },
  { name: "Pril Kraft Liquid Dishwash", brand: "Pril", subcategory: "Dishwash", price: 145, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600" },
  { name: "Lizol Disinfectant Surface Floor Cleaner Citrus", brand: "Lizol", subcategory: "Floor Cleaner", price: 220, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600" },
  { name: "Collin Glass & Surface Cleaner Spray", brand: "Collin", subcategory: "Cleaning", price: 110, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600" },
  { name: "Harpic Power Plus Disinfectant Toilet Cleaner", brand: "Harpic", subcategory: "Cleaning", price: 175, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600" },
  { name: "Origami 2 Ply Facial Tissues (Box of 100)", brand: "Origami", subcategory: "Tissue", price: 95, img: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?q=80&w=600" },
  { name: "Premier Kitchen Towel Paper Roll (Pack of 2)", brand: "Premier", subcategory: "Tissue", price: 130, img: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?q=80&w=600" },
  { name: "Shalimar Oxo-Biodegradable Garbage Bags (Medium 30 Pcs)", brand: "Shalimar", subcategory: "Garbage bags", price: 110, img: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?q=80&w=600" },
  { name: "Duracell Ultra AA Alkaline Batteries (Pack of 4)", brand: "Duracell", subcategory: "Batteries", price: 180, img: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?q=80&w=600" },
  { name: "Duracell AAA Alkaline Batteries (Pack of 4)", brand: "Duracell", subcategory: "Batteries", price: 180, img: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?q=80&w=600" },
  { name: "Eveready Red AA Batteries (Pack of 10)", brand: "Eveready", subcategory: "Batteries", price: 140, img: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?q=80&w=600" },
  { name: "Wipro 9W Cool Day White LED Bulb (Pack of 2)", brand: "Wipro", subcategory: "LED bulbs", price: 190, img: "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=600" },
  { name: "Philips 12W Stellar Bright LED Bulb", brand: "Philips", subcategory: "LED bulbs", price: 140, img: "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=600" },
  { name: "Anchor 4-Socket Extension Board with Master Switch (2m)", brand: "Anchor", subcategory: "Extension boards", price: 340, img: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=600" },
  { name: "GM 3060 E-Book 4 Socket Extension Spike Guard", brand: "GM", subcategory: "Extension boards", price: 480, img: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=600" },
  { name: "Milton Thermosteel Flip Lid Flask Bottle (1 L)", brand: "Milton", subcategory: "Water bottles", price: 790, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600" },
  { name: "Cello Duro Tuff Stainless Steel Water Bottle (750 ml)", brand: "Cello", subcategory: "Water bottles", price: 380, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600" },
  { name: "Milton Executive Stainless Steel Tiffin Lunch Box", brand: "Milton", subcategory: "Lunch boxes", price: 650, img: "https://images.unsplash.com/photo-1594998893017-36147cbcae05?q=80&w=600" },
  { name: "Signoraware Besto Plastic Lunch Box with Bag", brand: "Signoraware", subcategory: "Lunch boxes", price: 420, img: "https://images.unsplash.com/photo-1594998893017-36147cbcae05?q=80&w=600" },
  { name: "Borosil Vision Glass Mug Set (6 Pcs)", brand: "Borosil", subcategory: "Mug", price: 490, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600" },
  { name: "Clay Craft Ceramic Coffee Mug (350 ml)", brand: "Clay Craft", subcategory: "Mug", price: 180, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600" },
  { name: "Tupperware Modular Plastic Storage Container (Pack of 4)", brand: "Tupperware", subcategory: "Container", price: 890, img: "https://images.unsplash.com/photo-1594998893017-36147cbcae05?q=80&w=600" },
  { name: "Cello Checkers PET Plastic Container Set (18 Pcs)", brand: "Cello", subcategory: "Container", price: 620, img: "https://images.unsplash.com/photo-1594998893017-36147cbcae05?q=80&w=600" },
  { name: "Freshwrap Aluminium Foil (18 Meters)", brand: "Freshwrap", subcategory: "Aluminium Foil", price: 110, img: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?q=80&w=600" },
  { name: "Hindalco Freshwrap Heavy Duty Foil (9 Meters)", brand: "Hindalco", subcategory: "Aluminium Foil", price: 75, img: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?q=80&w=600" },
  { name: "Asahi Kasei Cling Wrap Food Wrap (30 Meters)", brand: "Asahi Kasei", subcategory: "Cling Film", price: 140, img: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?q=80&w=600" },
  { name: "Fevicol MR Squeezy Glue Bottle (100 g)", brand: "Pidilite", subcategory: "Stationery", price: 45, img: "https://images.unsplash.com/photo-1585336261026-6757688719d3?q=80&w=600" },
  { name: "Fevikwik Instant Adhesive (3 g)", brand: "Pidilite", subcategory: "Stationery", price: 10, img: "https://images.unsplash.com/photo-1585336261026-6757688719d3?q=80&w=600" },
  { name: "Kores Glue Stick Non-Toxic (15 g)", brand: "Kores", subcategory: "Stationery", price: 35, img: "https://images.unsplash.com/photo-1585336261026-6757688719d3?q=80&w=600" },
  { name: "Scotch High Tack Double Sided Tape", brand: "3M Scotch", subcategory: "Household", price: 90, img: "https://images.unsplash.com/photo-1585336261026-6757688719d3?q=80&w=600" },
  { name: "Godrej aer Pocket Bathroom Air Freshener Gel", brand: "Godrej", subcategory: "Household", price: 60, img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600" },
];

// GROUP 5: 50 Dresses / Fashion
const group5Raw = [
  { name: "Women Floral Printed Georgette Casual Midi Dress", brand: "Biba", subcategory: "Casual Dress", price: 1299, color: "Blue", size: "M", material: "Georgette", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Embroidered Cotton A-Line Kurti Dress", brand: "Biba", subcategory: "Kurti", price: 1499, color: "Yellow", size: "L", material: "Cotton", occasion: "Festive", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Satin V-Neck Evening Party Bodycon Dress", brand: "VERO MODA", subcategory: "Party Dress", price: 2499, color: "Black", size: "S", material: "Satin", occasion: "Party", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Vintage Polka Dot Cotton Summer Dress", brand: "ONLY", subcategory: "Summer Dress", price: 1699, color: "Red", size: "M", material: "Cotton", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Tiered Ruffled Chiffon Maxi Dress", brand: "Forever 21", subcategory: "Maxi Dress", price: 2199, color: "Pink", size: "L", material: "Chiffon", occasion: "Beachwear", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Classic Solid Cotton Shirt Dress with Belt", brand: "AND", subcategory: "Shirt Dress", price: 1899, color: "White", size: "S", material: "Cotton", occasion: "Workwear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Printed Rayon Anarkali Ethnic Kurti", brand: "W for Woman", subcategory: "Anarkali", price: 1999, color: "Green", size: "XL", material: "Rayon", occasion: "Ethnic", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Formal Notch Lapel Blazer Dress", brand: "Mango", subcategory: "Formal Dress", price: 3499, color: "Navy Blue", size: "M", material: "Polyester", occasion: "Formal", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Velvet Sequin Sleeveless Party Dress", brand: "Zara", subcategory: "Party Dress", price: 3999, color: "Burgundy", size: "S", material: "Velvet", occasion: "Night Party", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Cotton Linen Button-Down Midi Dress", brand: "FabIndia", subcategory: "Cotton Dress", price: 1799, color: "Beige", size: "M", material: "Linen Cotton", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Tropical Printed Wrap Front Summer Dress", brand: "H&M", subcategory: "Summer Dress", price: 1499, color: "Green", size: "XS", material: "Viscose", occasion: "Vacation", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Off-Shoulder Lace Fit & Flare Dress", brand: "ONLY", subcategory: "Knee-Length Dress", price: 2299, color: "White", size: "S", material: "Lace", occasion: "Cocktail", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Jacquard Silk Blend Ethnic Flare Dress", brand: "Aurelia", subcategory: "Ethnic Dress", price: 2599, color: "Purple", size: "L", material: "Silk Blend", occasion: "Festive", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Denim Belted Casual Utility Shirt Dress", brand: "Levis", subcategory: "Shirt Dress", price: 2799, color: "Blue", size: "M", material: "Denim Cotton", occasion: "Casual", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Ribbed Knit Bodycon Midi Dress", brand: "Forever New", subcategory: "Bodycon Dress", price: 3199, color: "Brown", size: "S", material: "Knit Viscose", occasion: "Evening Out", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Smocked Bodice Floral Cotton Sundress", brand: "Biba", subcategory: "Floral Dress", price: 1599, color: "Yellow", size: "M", material: "Cotton", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Block Printed Straight Cotton Kurti", brand: "FabIndia", subcategory: "Kurti", price: 1299, color: "Indigo Blue", size: "L", material: "Cotton", occasion: "Daily Wear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Pleated Metallic Foil Party Cocktail Dress", brand: "VERO MODA", subcategory: "Party Dress", price: 3499, color: "Gold", size: "M", material: "Polyester Metallic", occasion: "Party", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Chikankari Embroidered Handloom Ethnic Dress", brand: "FabIndia", subcategory: "Ethnic Dress", price: 2899, color: "Pastel Pink", size: "M", material: "Chanderi Cotton", occasion: "Festive", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women High-Low Hem Chiffon Evening Gown Dress", brand: "AND", subcategory: "A-Line Dress", price: 2999, color: "Emerald Green", size: "L", material: "Chiffon", occasion: "Formal Party", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Boho Embroidered Tassel Beach Mini Dress", brand: "H&M", subcategory: "Summer Dress", price: 1399, color: "Cream White", size: "S", material: "Cotton", occasion: "Vacation", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Satin Cowl Neck Backless Party Slip Dress", brand: "Zara", subcategory: "Party Dress", price: 2799, color: "Ruby Red", size: "XS", material: "Satin", occasion: "Party", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Tiered Pure Linen Sleeveless Midi Sundress", brand: "Uniqlo", subcategory: "Cotton Dress", price: 2499, color: "Sage Green", size: "L", material: "Linen", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Traditional Bandhani Print Flare Gown Kurti", brand: "Biba", subcategory: "Anarkali", price: 2299, color: "Mustard Yellow", size: "XL", material: "Silk Blend", occasion: "Festive", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Striped Cotton Canvas Casual Utility Dress", brand: "ONLY", subcategory: "Casual Dress", price: 1799, color: "Navy Striped", size: "M", material: "Cotton", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Puff Sleeve Sweetheart Neck Midi Dress", brand: "Forever New", subcategory: "Midi Dress", price: 3299, color: "Lavender", size: "S", material: "Georgette", occasion: "Date Night", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Gota Patti Work Chanderi Silk Ethnic Set", brand: "W for Woman", subcategory: "Ethnic Dress", price: 3599, color: "Maroon", size: "L", material: "Chanderi Silk", occasion: "Festive", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Double-Breasted Tailored Formals Blazer Dress", brand: "MANGO", subcategory: "Formal Dress", price: 4299, color: "Charcoal Black", size: "M", material: "Suiting Blend", occasion: "Corporate", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Geometric Printed Crepe Wrap Front Midi Dress", brand: "AND", subcategory: "Midi Dress", price: 1999, color: "Multicolor", size: "L", material: "Crepe", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Solid Tiered Smocked Cotton Maxi Dress", brand: "Biba", subcategory: "Maxi Dress", price: 2199, color: "Rust Orange", size: "M", material: "Cotton", occasion: "Day Out", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Short Sleeve A-Line Everyday Cotton Kurti", brand: "Aurelia", subcategory: "Kurti", price: 999, color: "Teal Green", size: "S", material: "Cotton", occasion: "Daily Wear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Halter Neck Backless Satin Evening Dress", brand: "Zara", subcategory: "Party Dress", price: 3499, color: "Champagne", size: "S", material: "Satin", occasion: "Cocktail", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Eyelet Embroidered Cotton Summer Beach Dress", brand: "H&M", subcategory: "Summer Dress", price: 1899, color: "White", size: "M", material: "Schiffli Cotton", occasion: "Vacation", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Jacquard Woven Silk Blend Indo-Western Dress", brand: "Biba", subcategory: "Ethnic Dress", price: 2999, color: "Royal Blue", size: "L", material: "Silk Jacquard", occasion: "Wedding Guest", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women High Neck Ribbed Bodycon Knee-Length Dress", brand: "VERO MODA", subcategory: "Knee-Length Dress", price: 2199, color: "Olive Green", size: "S", material: "Knit Cotton", occasion: "Casual", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Tropical Leaf Printed Chiffon Sundress", brand: "Forever 21", subcategory: "Floral Dress", price: 1499, color: "Coral Pink", size: "M", material: "Chiffon", occasion: "Vacation", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Kalamkari Printed Handloom Cotton Kurti", brand: "FabIndia", subcategory: "Kurti", price: 1599, color: "Earth Red", size: "L", material: "Handloom Cotton", occasion: "Workwear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Off-Shoulder Layered Organza Party Dress", brand: "Forever New", subcategory: "Party Dress", price: 3999, color: "Sky Blue", size: "S", material: "Organza", occasion: "Party", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Classic Trench Coat Style Shirt Dress", brand: "MANGO", subcategory: "Formal Dress", price: 4599, color: "Beige Khaki", size: "M", material: "Cotton Twill", occasion: "Formal", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Printed Rayon Tiered Smocked Midi Dress", brand: "ONLY", subcategory: "Midi Dress", price: 1699, color: "Peach", size: "XS", material: "Rayon", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Heavy Zari Work Georgette Anarkali Dress", brand: "W for Woman", subcategory: "Anarkali", price: 3999, color: "Deep Purple", size: "XL", material: "Georgette", occasion: "Wedding", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Plaid Checkered Cotton Vintage Shirt Dress", brand: "H&M", subcategory: "Shirt Dress", price: 1999, color: "Red Black Check", size: "M", material: "Cotton Flannel", occasion: "Casual", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Velvet Wrap Front V-Neck Evening Party Dress", brand: "Zara", subcategory: "Bodycon Dress", price: 3299, color: "Emerald Green", size: "S", material: "Velvet", occasion: "Party", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Solid Pure Cotton Breathable Summer Dress", brand: "FabIndia", subcategory: "Cotton Dress", price: 1699, color: "Lemon Yellow", size: "L", material: "Pure Cotton", occasion: "Casual", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Mirror Work Rayon Festive Ethnic Kurti", brand: "Aurelia", subcategory: "Kurti", price: 1399, color: "Magenta Pink", size: "M", material: "Rayon", occasion: "Festive", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Asymmetric Hem Satin Fit & Flare Cocktail Dress", brand: "VERO MODA", subcategory: "Knee-Length Dress", price: 2799, color: "Midnight Blue", size: "S", material: "Satin", occasion: "Cocktail", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Floral Printed Tiered Chiffon Maxi Dress", brand: "Biba", subcategory: "Maxi Dress", price: 2499, color: "Mint Green", size: "L", material: "Chiffon", occasion: "Day Out", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600" },
  { name: "Women Hand Block Printed Organic Cotton A-Line Kurti", brand: "FabIndia", subcategory: "Kurti", price: 1899, color: "Indigo White", size: "M", material: "Organic Cotton", occasion: "Casual", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
  { name: "Women Sequin Mesh Sleeveless Evening Party Dress", brand: "Forever New", subcategory: "Party Dress", price: 4499, color: "Rose Gold", size: "S", material: "Sequin Mesh", occasion: "Gala Party", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
  { name: "Women Solid Linen Lapel Collar Formal Shirt Dress", brand: "AND", subcategory: "Formal Dress", price: 2299, color: "Olive Tan", size: "M", material: "Linen Blend", occasion: "Workwear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
];

function generateListings(product, categoryGroup) {
  let marketplaces = GROCERY_MARKETPLACES;
  if (categoryGroup === 'electronics') {
    marketplaces = ELECTRONICS_MARKETPLACES;
  } else if (categoryGroup === 'dresses') {
    marketplaces = FASHION_MARKETPLACES;
  }

  const basePrice = product.price;
  const listings = [];

  const multipliers = {
    Blinkit: 1.00,
    Zepto: 1.05,
    'Swiggy Instamart': 1.02,
    BigBasket: 0.95,
    JioMart: 0.98,
    Amazon: 1.02,
    Flipkart: 0.98,
    Meesho: 0.94,
  };

  const ratings = {
    Blinkit: 4.4,
    Zepto: 4.3,
    'Swiggy Instamart': 4.5,
    BigBasket: 4.6,
    JioMart: 4.2,
    Amazon: 4.7,
    Flipkart: 4.5,
    Meesho: 4.1,
  };

  const reviewCounts = {
    Blinkit: 850,
    Zepto: 700,
    'Swiggy Instamart': 1100,
    BigBasket: 1400,
    JioMart: 650,
    Amazon: 5400,
    Flipkart: 4200,
    Meesho: 1800,
  };

  for (let idx = 0; idx < marketplaces.length; idx++) {
    const m = marketplaces[idx];
    const mult = multipliers[m] || 1.0;
    const price = Math.max(5, Math.round(basePrice * mult));
    const origPrice = Math.round(price * 1.22);
    const discount = Math.round(((origPrice - price) / origPrice) * 100);
    const directUrl = getMarketplaceBuyUrl(product, m);

    listings.push({
      listingId: `list-${product.id}-${m.toLowerCase().replace(/\s+/g, '')}`,
      marketplace: m,
      sellerName: m,
      price: price,
      originalPrice: origPrice,
      discount: discount,
      availability: true,
      currency: "INR",
      isDemo: true,
      urlType: "search",
      buyUrl: directUrl,
      productUrl: directUrl,
      sellerUrl: directUrl,
      rating: ratings[m] || 4.4,
      ratingCount: (reviewCounts[m] || 500) + 200,
      reviewCount: reviewCounts[m] || 500,
      status: "DEMO",
      priceStatusLabel: "DEMO PRICE"
    });
  }

  return listings;
}

const allProducts = [];

// Group 1: 50 Snacks & Beverages
group1Raw.forEach((item, index) => {
  const id = `prod-snackbev-${String(index + 1).padStart(3, '0')}`;
  const prod = {
    id,
    productId: id,
    name: item.name,
    brand: item.brand,
    category: "Snacks & Beverages",
    categoryType: "GROCERY",
    subcategory: item.subcategory,
    quantity: item.quantity,
    unit: item.unit,
    packSize: `${item.quantity} ${item.unit}`,
    imageUrl: item.img,
    imageAlt: `${item.name} (${item.quantity} ${item.unit})`,
    description: `${item.name} by ${item.brand}. High quality DEMO product for comparison.`,
    demoStatus: "DEMO DATA",
    listings: []
  };
  prod.listings = generateListings({ ...prod, price: item.price }, 'grocery');
  allProducts.push(prod);
});

// Group 2: 50 Grocery
group2Raw.forEach((item, index) => {
  const id = `prod-groc-${String(index + 1).padStart(3, '0')}`;
  const prod = {
    id,
    productId: id,
    name: item.name,
    brand: item.brand,
    category: "Grocery",
    categoryType: "GROCERY",
    subcategory: item.subcategory,
    quantity: item.quantity,
    unit: item.unit,
    packSize: `${item.quantity} ${item.unit}`,
    imageUrl: item.img,
    imageAlt: `${item.name} (${item.quantity} ${item.unit})`,
    description: `Fresh ${item.name} brought to you by ${item.brand}. Simulated DEMO marketplace listing.`,
    demoStatus: "DEMO DATA",
    listings: []
  };
  prod.listings = generateListings({ ...prod, price: item.price }, 'grocery');
  allProducts.push(prod);
});

// Group 3: 50 Electronics
group3Raw.forEach((item, index) => {
  const id = `prod-elec-${String(index + 1).padStart(3, '0')}`;
  const prod = {
    id,
    productId: id,
    name: item.name,
    brand: item.brand,
    category: "Electronics",
    categoryType: "ELECTRONICS",
    subcategory: item.subcategory,
    variant: item.specs ? Object.values(item.specs).join(" / ") : "Standard",
    imageUrl: item.img,
    imageAlt: item.name,
    description: `${item.name} featuring ${item.specs ? item.specs.processor || item.specs.ram : 'high performance'}. Realistic DEMO product listing.`,
    specs: item.specs || {},
    demoStatus: "DEMO DATA",
    listings: []
  };
  prod.listings = generateListings({ ...prod, price: item.price }, 'electronics');
  allProducts.push(prod);
});

// Group 4: 50 Departmental Store
group4Raw.forEach((item, index) => {
  const id = `prod-dept-${String(index + 1).padStart(3, '0')}`;
  const prod = {
    id,
    productId: id,
    name: item.name,
    brand: item.brand,
    category: "Departmental",
    categoryType: "GROCERY",
    subcategory: item.subcategory,
    imageUrl: item.img,
    imageAlt: item.name,
    description: `${item.name} for daily essential use. DEMO product details.`,
    demoStatus: "DEMO DATA",
    listings: []
  };
  prod.listings = generateListings({ ...prod, price: item.price }, 'grocery');
  allProducts.push(prod);
});

// Group 5: 50 Dresses / Fashion
group5Raw.forEach((item, index) => {
  const id = `prod-fashion-${String(index + 1).padStart(3, '0')}`;
  const prod = {
    id,
    productId: id,
    name: item.name,
    brand: item.brand,
    category: "Fashion",
    categoryType: "ELECTRONICS", // uses Amazon/Flipkart/Meesho
    subcategory: item.subcategory,
    color: item.color,
    size: item.size,
    material: item.material,
    occasion: item.occasion,
    imageUrl: item.img,
    imageAlt: `${item.name} - ${item.color}`,
    description: `${item.name} (${item.color}, ${item.size}). Elegant design for ${item.occasion}. DEMO product details.`,
    demoStatus: "DEMO DATA",
    listings: []
  };
  prod.listings = generateListings({ ...prod, price: item.price }, 'dresses');
  allProducts.push(prod);
});

console.log(`TOTAL GENERATED PRODUCTS: ${allProducts.length}`);

// Generate file content
const fileContent = `/**
 * ShopWise AI — 250 MOCK PRODUCT SEED DATASET
 *
 * EXACTLY 250 Realistic Mock Products divided into 5 Groups (50 each):
 * 1. Snacks & Beverages (50)
 * 2. Grocery (50)
 * 3. Electronics (50 - 25 Mobiles, 25 Laptops)
 * 4. Departmental / Daily Essentials (50)
 * 5. Dresses / Fashion (50)
 *
 * EVERY item contains realistic multi-marketplace listings with direct search URLs and DEMO status.
 */

export const TOTAL_MOCK_PRODUCTS = ${allProducts.length};

export const MOCK_PRODUCTS_DATA = ${JSON.stringify(allProducts, null, 2)};

if (MOCK_PRODUCTS_DATA.length !== 250) {
  throw new Error(\`Expected 250 mock products, found \${MOCK_PRODUCTS_DATA.length}\`);
}

export default MOCK_PRODUCTS_DATA;
`;

const outputPath = path.join(__dirname, '../data/mockProducts.js');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Saved 250 mock products dataset to: ${outputPath}`);
