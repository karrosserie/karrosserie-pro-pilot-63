
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
  unit_price: number; // Calculé automatiquement à partir du TTC
  discount: number;
  vat: number;
  total: number;
  total_ttc: number; // Montant TTC saisi par l'utilisateur
}
