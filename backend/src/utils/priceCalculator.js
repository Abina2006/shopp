// ============================================================
// ShopWise AI — Unit Price Calculator
// Migrated from ShopSense, supports grocery quantity comparison
// ============================================================

const unitToGrams = { g: 1, kg: 1000 };
const unitToMl = { ml: 1, litre: 1000, l: 1000 };
const unitToCount = { piece: 1, pack: 1, dozen: 12 };

/**
 * Convert a quantity+unit to a normalized numeric value in base units
 * e.g., 2 kg → 2000 (grams), 500 ml → 500, 1 dozen → 12
 */
export function toBaseUnit(value, unit) {
  const u = (unit || '').toLowerCase();
  if (unitToGrams[u] !== undefined) return value * unitToGrams[u];
  if (unitToMl[u] !== undefined) return value * unitToMl[u];
  if (unitToCount[u] !== undefined) return value * unitToCount[u];
  return value;
}

/**
 * Check if two units are compatible (same dimension)
 */
export function areUnitsCompatible(unit1, unit2) {
  const u1 = (unit1 || '').toLowerCase();
  const u2 = (unit2 || '').toLowerCase();
  if (unitToGrams[u1] !== undefined && unitToGrams[u2] !== undefined) return true;
  if (unitToMl[u1] !== undefined && unitToMl[u2] !== undefined) return true;
  if (unitToCount[u1] !== undefined && unitToCount[u2] !== undefined) return true;
  return u1 === u2;
}

/**
 * Calculate price for a given quantity based on a known base price/quantity/unit.
 */
export function calculatePrice(basePrice, baseQuantity, baseUnit, selectedQuantity, selectedUnit) {
  const baseInUnits = toBaseUnit(baseQuantity, baseUnit);
  const selectedInUnits = toBaseUnit(selectedQuantity, selectedUnit);

  if (baseInUnits === 0) return 0;

  const pricePerUnit = basePrice / baseInUnits;
  const calculatedPrice = pricePerUnit * selectedInUnits;

  return Math.round(calculatedPrice * 100) / 100;
}

/**
 * Calculate unit price (price per standard unit: per kg, per litre, per piece)
 */
export function calculateUnitPrice(price, quantity, unit) {
  const u = (unit || '').toLowerCase();
  if (unitToGrams[u] !== undefined) {
    const grams = quantity * unitToGrams[u];
    if (grams === 0) return 0;
    return Math.round((price / grams) * 1000 * 100) / 100; // per kg
  }
  if (unitToMl[u] !== undefined) {
    const ml = quantity * unitToMl[u];
    if (ml === 0) return 0;
    return Math.round((price / ml) * 1000 * 100) / 100; // per litre
  }
  if (unitToCount[u] !== undefined) {
    const count = quantity * unitToCount[u];
    if (count === 0) return 0;
    return Math.round((price / count) * 100) / 100; // per piece
  }
  return price;
}

/**
 * Format a price in Indian Rupees
 */
export function formatPrice(amount) {
  if (amount === 0) return '₹0';
  if (amount % 1 === 0) return `₹${amount}`;
  return `₹${amount.toFixed(2)}`;
}

/**
 * Format quantity with unit for display
 */
export function formatQuantity(value, unit) {
  if (unit === 'dozen') return `${value} dozen`;
  if (value >= 1000 && (unit === 'g' || unit === 'G')) return `${value / 1000} kg`;
  if (value >= 1000 && (unit === 'ml' || unit === 'ML')) return `${value / 1000} L`;
  return `${value} ${unit}`;
}

export default calculatePrice;
