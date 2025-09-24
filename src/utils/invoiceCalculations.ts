import { safeNumber } from '@/lib/utils';

export interface InvoiceItem {
  id?: string;
  label?: string;
  description?: string;
  quantity?: number;
  unitCost?: number;
  discount?: number;
  vat?: number;
}

export const parseInvoiceData = (data: any): InvoiceItem[] => {
  let items = Array.isArray(data) ? data : 
    (typeof data === 'string' ? JSON.parse(data || '[]') : []);
  
  // Normaliser les valeurs numériques pour éviter les problèmes avec les virgules
  return items.map(item => ({
    ...item,
    quantity: safeNumber(item.quantity),
    unitCost: safeNumber(item.unitCost),
    discount: safeNumber(item.discount),
    vat: safeNumber(item.vat || 20)
  }));
};

export const calculateInvoiceTotals = (repairsData: any, partsData: any) => {
  const repairs = parseInvoiceData(repairsData);
  const parts = parseInvoiceData(partsData);
  const allItems = [...repairs, ...parts];

  const subtotal = allItems.reduce((sum, item) => 
    sum + (safeNumber(item.quantity) * safeNumber(item.unitCost)), 0);

  const totalDiscount = allItems.reduce((sum, item) => {
    const itemTotal = safeNumber(item.quantity) * safeNumber(item.unitCost);
    return sum + (itemTotal * safeNumber(item.discount) / 100);
  }, 0);

  const subtotalAfterDiscount = subtotal - totalDiscount;

  const totalVAT = allItems.reduce((sum, item) => {
    const itemTotal = safeNumber(item.quantity) * safeNumber(item.unitCost);
    const itemAfterDiscount = itemTotal - (itemTotal * safeNumber(item.discount) / 100);
    return sum + (itemAfterDiscount * safeNumber(item.vat || 20) / 100);
  }, 0);

  const finalTotal = subtotalAfterDiscount + totalVAT;

  return {
    allItems,
    subtotal,
    totalDiscount,
    subtotalAfterDiscount,
    totalVAT,
    finalTotal
  };
};

export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};