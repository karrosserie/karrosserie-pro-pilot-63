
export interface Invoice {
  id: string;
  reference: string;
  repair_order_id?: string | null;
  client_id?: string | null;
  vehicle_id?: string | null;
  status?: string;
  created_at: string;
  due_date?: string | null;
  payment_date?: string | null;
  payment_due_date?: string | null;
  payment_details?: string | null;
  description?: string | null;
  amount?: number | null;
  repairs_data?: string | any[] | null;
  parts_data?: string | any[] | null;
  discounts_data?: string | any[] | null;
  claim_number?: string | null;
  current_mileage?: string | null;
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  vehicles?: {
    id: string;
    brand: string;
    model: string;
    license_plate: string;
  };
  user_id: string;
}

export type NewInvoice = Omit<Invoice, 'id' | 'created_at' | 'user_id'>;
export type UpdateInvoice = Partial<NewInvoice>;

export interface Item {
  id: string;
  label: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  vat: number;
}

export interface Discount {
  id: string;
  label: string;
  type: 'percentage' | 'fixed';
  value: number;
}

export interface InvoiceData {
  invoice: Invoice;
  repairs?: Item[];
  parts?: Item[];
  discounts?: Discount[];
}
