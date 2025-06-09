
export interface Expense {
  id?: string;
  type: string;
  proof_url?: string;
  date: string;
  vat_amount: number | string;
  total_amount: number | string;
  supplier: string;
  category: string;
  status: string;
  assign_to_vehicle: boolean;
  vehicle_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  vehicles?: {
    id: string;
    brand: string;
    model: string;
    license_plate: string;
  };
}

export interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
