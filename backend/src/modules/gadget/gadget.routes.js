import express from 'express';
import { gadgets } from '../../data/gadgets.js';

const router = express.Router();

// GET /api/gadgets – list all curated gadgets
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: gadgets });
});

export default router;
