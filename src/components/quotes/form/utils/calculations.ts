
import { QuoteRepairItem, QuotePartItem, QuoteDiscountItem, GlobalTotals } from '../types';

// Fonction utilitaire pour calculer le total d'une ligne (réparation ou pièce)
export const calculateLineTotal = (
  quantity: number,
  unitCost: number,
  discount: number = 0,
  vat: number = 0
): number => {
  const subtotal = quantity * unitCost;
  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const vatAmount = afterDiscount * (vat / 100);
  return afterDiscount + vatAmount;
};

export const calculateGlobalTotals = (
  repairs: QuoteRepairItem[],
  parts: QuotePartItem[],
  discounts: QuoteDiscountItem[]
): GlobalTotals => {
  const repairTotals = repairs.reduce((acc, repair) => {
    const subtotal = repair.quantity * repair.unitCost;
    const discountAmount = subtotal * (repair.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const vatAmount = afterDiscount * (repair.vat / 100);
    const lineTotal = afterDiscount + vatAmount; // Calcul correct du total de ligne
    
    return {
      subTotal: acc.subTotal + subtotal,
      totalVat: acc.totalVat + vatAmount,
      totalDiscount: acc.totalDiscount + discountAmount,
      total: acc.total + lineTotal // Utiliser le calcul correct
    };
  }, { subTotal: 0, totalVat: 0, totalDiscount: 0, total: 0 });

  const partTotals = parts.reduce((acc, part) => {
    const subtotal = part.quantity * part.unitCost;
    const discountAmount = subtotal * (part.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const vatAmount = afterDiscount * (part.vat / 100);
    const lineTotal = afterDiscount + vatAmount; // Calcul correct du total de ligne
    
    return {
      subTotal: acc.subTotal + subtotal,
      totalVat: acc.totalVat + vatAmount,
      totalDiscount: acc.totalDiscount + discountAmount,
      total: acc.total + lineTotal // Utiliser le calcul correct
    };
  }, { subTotal: 0, totalVat: 0, totalDiscount: 0, total: 0 });

  // Calculer le total des remises additionnelles
  const additionalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0);

  return {
    subTotal: repairTotals.subTotal + partTotals.subTotal,
    totalVat: repairTotals.totalVat + partTotals.totalVat,
    totalDiscount: repairTotals.totalDiscount + partTotals.totalDiscount + additionalDiscounts,
    total: repairTotals.total + partTotals.total - additionalDiscounts
  };
};
