
export interface InvoiceEmailFormData {
  to: string;
  subject: string;
  message: string;
}

export interface InvoiceEmailProps {
  invoiceId: string;
  invoiceReference: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}
