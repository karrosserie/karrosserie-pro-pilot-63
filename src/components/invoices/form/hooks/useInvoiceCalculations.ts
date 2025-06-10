
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem, GlobalTotals } from '../types';

export const useInvoiceCalculations = () => {
  const calculateGlobalTotals = (
    repairs: InvoiceRepairItem[],
    parts: InvoicePartItem[],
    discounts: InvoiceDiscountItem[]
  ): GlobalTotals => {
    const repairTotals = repairs.reduce((acc, repair) => {
      const subtotal = repair.quantity * repair.unitCost;
      const discountAmount = subtotal * (repair.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      const vatAmount = afterDiscount * (repair.vat / 100);
      
      return {
        subtotal: acc.subtotal + subtotal,
        vatTotal: acc.vatTotal + vatAmount,
        discountTotal: acc.discountTotal + discountAmount,
        total: acc.total + repair.total
      };
    }, { subtotal: 0, vatTotal: 0, discountTotal: 0, total: 0 });

    const partTotals = parts.reduce((acc, part) => {
      const subtotal = part.quantity * part.unitCost;
      const discountAmount = subtotal * (part.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      const vatAmount = afterDiscount * (part.vat / 100);
      
      return {
        subtotal: acc.subtotal + subtotal,
        vatTotal: acc.vatTotal + vatAmount,
        discountTotal: acc.discountTotal + discountAmount,
        total: acc.total + part.total
      };
    }, { subtotal: 0, vatTotal: 0, discountTotal: 0, total: 0 });

    const globalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0);

    return {
      subtotal: repairTotals.subtotal + partTotals.subtotal,
      vatTotal: repairTotals.vatTotal + partTotals.vatTotal,
      discountTotal: repairTotals.discountTotal + partTotals.discountTotal + globalDiscounts,
      total: repairTotals.total + partTotals.total - globalDiscounts
    };
  };

  return { calculateGlobalTotals };
};
