
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { EmailFormFields } from '../invoices/email/EmailFormFields';
import { EmailDialogActions } from '../invoices/email/EmailDialogActions';
import { GeneratedReport } from '@/hooks/use-generated-reports';
import { useReportEmail } from './email/useReportEmail';

interface ReportEmailFormData {
  to: string;
  subject: string;
  message: string;
}

interface EmailReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: GeneratedReport | null;
  onSend: (email: string) => void;
}

export const EmailReportDialog = ({ 
  open, 
  onOpenChange, 
  report, 
  onSend 
}: EmailReportDialogProps) => {
  const { getDefaultEmailData, sendEmail, isLoading } = useReportEmail(report);
  const [emailData, setEmailData] = useState<ReportEmailFormData>({
    to: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (open && report) {
      getDefaultEmailData().then(setEmailData);
    }
  }, [open, report]);

  const handleFieldChange = (field: keyof ReportEmailFormData, value: string) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    const success = await sendEmail(emailData);
    if (success) {
      onOpenChange(false);
    }
  };

  const isFormValid = Boolean(emailData.to && emailData.subject && emailData.message);

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Envoyer le rapport par email</DialogTitle>
        </DialogHeader>

        <EmailFormFields
          data={emailData}
          onChange={handleFieldChange}
          isLoading={isLoading}
          invoiceReference={report.name}
          documentType="invoice"
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
