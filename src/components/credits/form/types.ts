
export interface CreditFormData {
  reference: string;
  client_id: string | null;
  vehicle_id: string | null;
  invoice_id: string | null;
  status: 'En attente' | 'Payé';
  notes?: string;
}

export interface CreditItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}
