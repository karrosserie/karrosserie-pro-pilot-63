
export interface Expense {
  id?: string;
  reference: string;
  date: string;
  amount: number | string;
  status: string;
  supplier: string;
  category: string;
  payment_method: string;
  bank_account: string;
  description: string;
}

export interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (data: Expense) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
