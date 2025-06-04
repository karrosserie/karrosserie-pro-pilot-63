
export interface CreditFormData {
  reference: string;
  client_id: string | null;
  vehicle_id: string | null;
  original_invoice_id: string | null;
  original_invoice_reference: string;
  amount: number;
  reason: string;
  status: 'En attente' | 'Validé' | 'Annulé';
  notes?: string;
}

export interface CreditItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}
