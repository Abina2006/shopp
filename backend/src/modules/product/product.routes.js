import { Router } from 'express';
import { 
  scrapeProduct, 
  listProducts, 
  getProduct, 
  getProductAISummary, 
  getComparison, 
  streamLiveUpdates,
  syncProductPriceHandler,
  syncAllProductsHandler,
  getSmartAdvisorHandler,
  createPriceAlertHandler,
  getBudgetAdvisorHandler,
  searchProductsHandler,
  smartSearchHandler
} from './product.controller.js';

const router = Router();

// GET  /api/products/smart-search - Smart NLP query search with quantity/spec clarification
router.get('/smart-search', smartSearchHandler);

// GET  /api/products/search - Cross-platform product search (Amazon, Flipkart, Meesho)
router.get('/search', searchProductsHandler);

// GET  /api/products/budget-advisor - AI Product Recommendation within user budget
router.get('/budget-advisor', getBudgetAdvisorHandler);

// GET  /api/products/live-stream - Server-Sent Events (SSE) real-time stream
router.get('/live-stream', streamLiveUpdates);

// POST /api/products/sync-all-live - Sync all products with live market prices
router.post('/sync-all-live', syncAllProductsHandler);

// POST /api/products/:id/sync-live-price - Sync single product live market prices
router.post('/:id/sync-live-price', syncProductPriceHandler);

// GET  /api/products/:id/smart-advisor - AI Smart Shopping Assistant & Price History Graph
router.get('/:id/smart-advisor', getSmartAdvisorHandler);

// POST /api/products/:id/price-alert - Create price drop notification alert
router.post('/:id/price-alert', createPriceAlertHandler);

// POST /api/products/scrape  – paste URL to trigger Scrapy
router.post('/scrape', scrapeProduct);

// GET  /api/products          – list all scraped products
router.get('/', listProducts);

// GET  /api/products/compare – compare multiple products
router.get('/compare', getComparison);

// GET  /api/products/:id/ai-summary – AI review breakdown & sentiment
router.get('/:id/ai-summary', getProductAISummary);

// GET  /api/products/:id      – get single product + reviews
router.get('/:id', getProduct);

export default router;


