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
import { useCreditEmail } from './useCreditEmail';
import { InvoiceEmailFormData } from '../../invoices/email/types';

interface CreditEmailDialogProps {
  credit: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditEmailDialog = ({ credit, open, onOpenChange }: CreditEmailDialogProps) => {
  const { getDefaultEmailData, sendEmail, isLoading } = useCreditEmail(credit);
  const [emailData, setEmailData] = useState<InvoiceEmailFormData>({
    to: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (open && credit) {
      getDefaultEmailData().then(setEmailData);
    }
  }, [open, credit]);

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
          <DialogTitle>Envoyer l'avoir par e-mail</DialogTitle>
        </DialogHeader>

        <EmailFormFields
          data={emailData}
          onChange={handleFieldChange}
          isLoading={isLoading}
          invoiceReference={credit?.reference}
          documentType="credit"
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

export default CreditEmailDialog;