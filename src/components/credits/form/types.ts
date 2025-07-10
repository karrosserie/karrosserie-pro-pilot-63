
export interface CreditFormData {
  reference: string;
  invoice_id: string | null;
  status: 'En attente' | 'Payé';
  notes?: string;
}

export interface CreditItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  vat: number;
  total: number;
}
