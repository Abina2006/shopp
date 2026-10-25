import * as budgetService from './budget.service.js';

export async function getBudget(req, res) {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

    const budget = await budgetService.getBudget(userId);
    return res.json({ success: true, data: budget || { monthlyLimit: 0, groceryLimit: 0 } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function setBudget(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

    const { monthlyLimit, groceryLimit } = req.body;
    const budget = await budgetService.setBudget(userId, monthlyLimit || 0, groceryLimit || 0);
    return res.json({ success: true, data: budget });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function clearBudget(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

    await budgetService.clearBudget(userId);
    return res.json({ success: true, message: 'Budget cleared' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
