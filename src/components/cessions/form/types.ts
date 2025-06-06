
export interface CessionFormData {
  reference: string;
  vehicle_id: string | null;
  buyer_name: string;
  buyer_contact: string;
  sale_amount: number;
  sale_date: string;
  status: 'en_attente' | 'envoyee' | 'signee' | 'payee';
  notes?: string;
}

export interface CessionFormErrors {
  reference?: string;
  vehicle_id?: string;
  buyer_name?: string;
  buyer_contact?: string;
  sale_amount?: string;
  sale_date?: string;
  status?: string;
}
