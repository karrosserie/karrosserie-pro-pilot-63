
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { QuoteEmailDialogProps } from './email/types';
import { useQuoteEmail } from './email/useQuoteEmail';
import EmailFormFields from './email/EmailFormFields';
import EmailDialogActions from './email/EmailDialogActions';

const QuoteEmailDialog: React.FC<QuoteEmailDialogProps> = ({
  open,
  onOpenChange,
  quote
}) => {
  const {
    formData,
    isLoading,
    updateFormData,
    sendEmail,
    resetForm
  } = useQuoteEmail(quote, open);

  const handleSend = async () => {
    const success = await sendEmail();
    if (success) {
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoyer le devis par e-mail
          </DialogTitle>
          <DialogDescription>
            Envoyer le devis {quote?.reference || ''} par e-mail au client.
          </DialogDescription>
        </DialogHeader>
        
        <EmailFormFields
          formData={formData}
          onUpdateFormData={updateFormData}
          disabled={isLoading}
        />
        
        <EmailDialogActions
          onCancel={handleClose}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuoteEmailDialog;
