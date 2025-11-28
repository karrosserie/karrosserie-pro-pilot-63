
import { safeNumber } from '@/lib/utils';
import { QuoteRepairItem, QuotePartItem, QuoteDiscountItem, GlobalTotals } from '../types';

// Fonction utilitaire pour calculer le total d'une ligne (réparation ou pièce)
export const calculateLineTotal = (
  quantity: number,
  unitCost: number,
  discount: number = 0,
  vat: number = 0
): number => {
  const safeQuantity = safeNumber(quantity);
  const safeUnitCost = safeNumber(unitCost);
  const safeDiscount = safeNumber(discount);
  const safeVat = safeNumber(vat);
  
  const subtotal = Math.round((safeQuantity * safeUnitCost) * 100) / 100;
  const discountAmount = Math.round((subtotal * (safeDiscount / 100)) * 100) / 100;
  const afterDiscount = Math.round((subtotal - discountAmount) * 100) / 100;
  const vatAmount = Math.round((afterDiscount * (safeVat / 100)) * 100) / 100;
  return Math.round((afterDiscount + vatAmount) * 100) / 100;
};

export const calculateGlobalTotals = (
  repairs: QuoteRepairItem[],
  parts: QuotePartItem[],
  discounts: QuoteDiscountItem[]
): GlobalTotals => {
  const repairTotals = repairs.reduce((acc, repair) => {
    const subtotal = Math.round((safeNumber(repair.quantity) * safeNumber(repair.unitCost)) * 100) / 100;
    const discountAmount = Math.round((subtotal * (safeNumber(repair.discount) / 100)) * 100) / 100;
    const afterDiscount = Math.round((subtotal - discountAmount) * 100) / 100;
    const vatAmount = Math.round((afterDiscount * (safeNumber(repair.vat) / 100)) * 100) / 100;
    const lineTotal = Math.round((afterDiscount + vatAmount) * 100) / 100;
    
    return {
      subTotal: Math.round((acc.subTotal + subtotal) * 100) / 100,
      totalVat: Math.round((acc.totalVat + vatAmount) * 100) / 100,
      totalDiscount: Math.round((acc.totalDiscount + discountAmount) * 100) / 100,
      total: Math.round((acc.total + lineTotal) * 100) / 100
    };
  }, { subTotal: 0, totalVat: 0, totalDiscount: 0, total: 0 });

  const partTotals = parts.reduce((acc, part) => {
    const subtotal = Math.round((safeNumber(part.quantity) * safeNumber(part.unitCost)) * 100) / 100;
    const discountAmount = Math.round((subtotal * (safeNumber(part.discount) / 100)) * 100) / 100;
    const afterDiscount = Math.round((subtotal - discountAmount) * 100) / 100;
    const vatAmount = Math.round((afterDiscount * (safeNumber(part.vat) / 100)) * 100) / 100;
    const lineTotal = Math.round((afterDiscount + vatAmount) * 100) / 100;
    
    return {
      subTotal: Math.round((acc.subTotal + subtotal) * 100) / 100,
      totalVat: Math.round((acc.totalVat + vatAmount) * 100) / 100,
      totalDiscount: Math.round((acc.totalDiscount + discountAmount) * 100) / 100,
      total: Math.round((acc.total + lineTotal) * 100) / 100
    };
  }, { subTotal: 0, totalVat: 0, totalDiscount: 0, total: 0 });

  // Calculer le total des remises additionnelles (supporte amount OU finalAmount)
  const additionalDiscounts = discounts.reduce((sum, discount) => {
    const discountAmount = safeNumber(discount.amount ?? discount.finalAmount ?? 0);
    return sum + discountAmount;
  }, 0);

  return {
    subTotal: Math.round((repairTotals.subTotal + partTotals.subTotal) * 100) / 100,
    totalVat: Math.round((repairTotals.totalVat + partTotals.totalVat) * 100) / 100,
    totalDiscount: Math.round((repairTotals.totalDiscount + partTotals.totalDiscount + additionalDiscounts) * 100) / 100,
    total: Math.round((repairTotals.total + partTotals.total - additionalDiscounts) * 100) / 100
  };
};
