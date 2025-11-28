
export interface InvoiceRepairItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vat: number;
  total: number;
}

export interface InvoicePartItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vat: number;
  total: number;
}

export interface InvoiceDiscountItem {
  id: string;
  description?: string;
  label?: string;  // Format n8n
  amount?: number;
  finalAmount?: number;  // Format n8n
}

export interface GlobalTotals {
  subtotal: number;
  vatTotal: number;
  discountTotal: number;
  total: number;
}
