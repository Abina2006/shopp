import prisma from '../../config/db.js';

export async function getBudget(userId) {
  return prisma.budget.findUnique({ where: { userId } });
}

export async function setBudget(userId, monthlyLimit, groceryLimit = 0) {
  return prisma.budget.upsert({
    where: { userId },
    update: { monthlyLimit, groceryLimit },
    create: { userId, monthlyLimit, groceryLimit },
  });
}

export async function clearBudget(userId) {
  return prisma.budget.delete({ where: { userId } }).catch(() => null);
}
