
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpertiseReportUploader } from '@/components/expertise/ExpertiseReportUploader';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportDialog = ({ open, onOpenChange }: ImportDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleSuccess = () => {
    setIsUploading(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (!isUploading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isUploading ? onOpenChange : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importer un PV d'expertise</DialogTitle>
          <DialogDescription>
            Importez un procès verbal d'expertise au format PDF.
          </DialogDescription>
        </DialogHeader>
        
        <ExpertiseReportUploader 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
