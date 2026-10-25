import express from 'express';
import { getBudget, setBudget, clearBudget } from './budget.controller.js';

const router = express.Router();

router.get('/', getBudget);
router.post('/', setBudget);
router.delete('/', clearBudget);

export default router;
