
export interface Expense {
  id?: string;
  type?: string;
  proof_url?: string;
  date: string;
  vat_amount: number | string;
  total_amount: number | string;
  supplier: string;
  category: string;
  assign_to_vehicle: boolean;
  vehicle_id?: string;
}

export interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (data: Expense) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
