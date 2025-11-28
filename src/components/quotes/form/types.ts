
export interface QuoteRepairItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vat: number;
  total: number;
}

export interface QuotePartItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vat: number;
  total: number;
}

export interface QuoteDiscountItem {
  id: string;
  description?: string;
  label?: string;  // Format n8n
  amount?: number;
  finalAmount?: number;  // Format n8n
}

export interface GlobalTotals {
  subTotal: number;
  totalVat: number;
  totalDiscount: number;
  total: number;
}
