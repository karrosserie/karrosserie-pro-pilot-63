export interface InvoiceItem {
  id?: string;
  label?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  discount?: number;
  vat?: number;
}

export const parseInvoiceData = (data: any): InvoiceItem[] => {
  return Array.isArray(data) ? data : 
    (typeof data === 'string' ? JSON.parse(data || '[]') : []);
};

export const calculateInvoiceTotals = (repairsData: any, partsData: any) => {
  const repairs = parseInvoiceData(repairsData);
  const parts = parseInvoiceData(partsData);
  const allItems = [...repairs, ...parts];

  const subtotal = allItems.reduce((sum, item) => 
    sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);

  const totalDiscount = allItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    return sum + (itemTotal * (item.discount || 0) / 100);
  }, 0);

  const subtotalAfterDiscount = subtotal - totalDiscount;

  const totalVAT = allItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    const itemAfterDiscount = itemTotal - (itemTotal * (item.discount || 0) / 100);
    return sum + (itemAfterDiscount * (item.vat || 20) / 100);
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