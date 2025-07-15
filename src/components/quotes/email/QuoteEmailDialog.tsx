import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailFormFields } from '../../invoices/email/EmailFormFields';
import { EmailDialogActions } from '../../invoices/email/EmailDialogActions';
import { useQuoteEmail } from './useQuoteEmail';
import { InvoiceEmailFormData } from '../../invoices/email/types';
import { Quote } from '@/services/supabase/quotes';

interface QuoteEmailDialogProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuoteEmailDialog = ({ quote, open, onOpenChange }: QuoteEmailDialogProps) => {
  const { getDefaultEmailData, sendEmail, isLoading } = useQuoteEmail(quote);
  const [emailData, setEmailData] = useState<InvoiceEmailFormData>({
    to: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (open && quote) {
      getDefaultEmailData().then(setEmailData);
    }
  }, [open, quote]);

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
          <DialogTitle>Envoyer le devis par e-mail</DialogTitle>
        </DialogHeader>

        <EmailFormFields
          data={emailData}
          onChange={handleFieldChange}
          isLoading={isLoading}
          invoiceReference={quote?.reference}
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

export default QuoteEmailDialog;