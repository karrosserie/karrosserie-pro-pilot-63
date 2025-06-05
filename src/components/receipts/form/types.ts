
export interface Receipt {
  id?: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  invoice: string;
  payment_method: string;
  bank_account: string;
  notes?: string;
  payment_proofs?: string[];
}

export interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (data: Receipt) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
