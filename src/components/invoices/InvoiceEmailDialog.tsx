
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailFormFields } from './email/EmailFormFields';
import { EmailDialogActions } from './email/EmailDialogActions';
import { useInvoiceEmail } from './email/useInvoiceEmail';
import { InvoiceEmailFormData, InvoiceEmailProps } from './email/types';
import { Invoice } from '@/services/supabase/invoices';

interface InvoiceEmailDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvoiceEmailDialog = ({ invoice, open, onOpenChange }: InvoiceEmailDialogProps) => {
  const { getDefaultEmailData, sendEmail, isLoading } = useInvoiceEmail(invoice);
  const [emailData, setEmailData] = useState<InvoiceEmailFormData>({
    to: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (open && invoice) {
      getDefaultEmailData().then(setEmailData);
    }
  }, [open, invoice]);

  const handleFieldChange = (field: keyof InvoiceEmailFormData, value: string) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    const success = await sendEmail(emailData);
    if (success) {
      onOpenChange(false);
    }
  };

  const isFormValid = Boolean(emailData.to && emailData.subject && emailData.message);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer la facture par e-mail</DialogTitle>
        </DialogHeader>

        <EmailFormFields
          data={emailData}
          onChange={handleFieldChange}
          isLoading={isLoading}
        />

        <EmailDialogActions
          onCancel={() => onOpenChange(false)}
          onSend={handleSend}
          isLoading={isLoading}
          isFormValid={isFormValid}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceEmailDialog;
