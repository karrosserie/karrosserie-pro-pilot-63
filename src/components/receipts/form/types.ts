
export interface Receipt {
  id?: string;
  reference?: string;
  date: string;
  amount: number | string;
  status: string;
  invoice: string;
  payment_method: string;
  bank_account: string;
  notes?: string;
  payment_proofs?: string[];
  invoice_id?: string | null;
}

export interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (data: Receipt) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
