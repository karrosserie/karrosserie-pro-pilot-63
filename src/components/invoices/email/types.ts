
import { Invoice } from '@/services/supabase/invoices';

export interface EmailFormData {
  recipient: string;
  subject: string;
  message: string;
}

export interface InvoiceEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}
