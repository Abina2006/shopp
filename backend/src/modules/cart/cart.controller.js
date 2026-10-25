import * as cartService from './cart.service.js';

export async function getCart(req, res) {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

    const items = await cartService.getCartItems(userId);
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.listing?.price || 0);
      return sum + price * item.quantity;
    }, 0);

    return res.json({ success: true, data: items, total: Math.round(total * 100) / 100, count: items.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addToCart(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

    const { listingId, quantity, unit } = req.body;
    if (!listingId) return res.status(400).json({ success: false, message: 'Listing ID required' });

    const item = await cartService.addCartItem(userId, listingId, quantity || 1, unit);
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

    const { id } = req.params;
    const { quantity, unit } = req.body;
    const item = await cartService.updateCartItem(userId, id, quantity, unit);
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });

    return res.json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function removeFromCart(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

    const result = await cartService.removeCartItem(userId, req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Cart item not found' });

    return res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function clearCartHandler(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

    await cartService.clearCart(userId);
    return res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
