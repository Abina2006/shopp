import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCartHandler } from './cart.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

// All cart routes require a valid JWT
router.use(authenticate);

router.get('/', getCart);
router.post('/', addToCart);
router.patch('/:id', updateCartItem);
router.delete('/clear', clearCartHandler);
router.delete('/:id', removeFromCart);

export default router;
