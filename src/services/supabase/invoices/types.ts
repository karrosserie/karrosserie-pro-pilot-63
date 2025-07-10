
export interface Invoice {
  id: string;
  reference: string;
  repair_order_id?: string | null;
  client_id?: string | null;
  vehicle_id?: string | null;
  status?: string;
  created_at: string;
  date?: string | null;
  due_date?: string | null;
  payment_details?: string | null;
  notes?: string | null;
  amount?: number | null;
  repairs_data?: string | any[] | null;
  parts_data?: string | any[] | null;
  discounts_data?: string | any[] | null;
  claim_number?: string | null;
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  vehicles?: {
    id: string;
    license_plate: string;
    car_brands?: {
      id: string;
      name: string;
    };
    car_models?: {
      id: string;
      name: string;
    };
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
