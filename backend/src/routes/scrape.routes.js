import express from 'express';
import { scrapeProduct } from '../controllers/scrape.controller.js';
const router = express.Router();

// POST /api/scrape  { url: "https://..." }
router.post('/', scrapeProduct);

export default router;
