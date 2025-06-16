
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { RepairOrderEmailDialogProps } from './email/types';
import { useRepairOrderEmail } from './email/useRepairOrderEmail';
import EmailFormFields from './email/EmailFormFields';
import EmailDialogActions from './email/EmailDialogActions';

const RepairOrderEmailDialog: React.FC<RepairOrderEmailDialogProps> = ({
  open,
  onOpenChange,
  repairOrder
}) => {
  const {
    formData,
    isLoading,
    updateFormData,
    sendEmail,
    resetForm
  } = useRepairOrderEmail(repairOrder, open);

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
            Envoyer l'ordre de réparation par e-mail
          </DialogTitle>
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

export default RepairOrderEmailDialog;
