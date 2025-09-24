
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormDialog } from '@/hooks/use-form-dialog';
import VehicleForm from './VehicleForm';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  defaultValues?: any;
  onSubmit: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
}

const VehicleDialog: React.FC<VehicleDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  defaultValues = {},
  onSubmit,
  mode
}) => {
  const { handleOpenChange: handleDialogOpenChange } = useFormDialog({ 
    hasUnsavedChanges: mode === 'create' || mode === 'edit',
    onOpenChange 
  });
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={mode === 'view' ? onOpenChange : handleDialogOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <VehicleForm 
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          isViewMode={mode === 'view'}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
