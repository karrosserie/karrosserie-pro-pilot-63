
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
  description: string;
  amount: number;
}

export interface GlobalTotals {
  subtotal: number;
  vatTotal: number;
  discountTotal: number;
  total: number;
}
