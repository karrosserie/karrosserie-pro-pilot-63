
import React, { useState } from 'react';
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importer un rapport d'expertise</DialogTitle>
          <DialogDescription>
            Importez un rapport d'expertise au format PDF.
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
