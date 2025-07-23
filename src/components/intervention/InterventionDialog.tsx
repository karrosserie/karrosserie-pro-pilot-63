import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InterventionForm } from './InterventionForm';
import { Client } from '@/services/supabase/clients';

interface InterventionDialogProps {
  client?: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InterventionDialog = ({
  client,
  open,
  onOpenChange
}: InterventionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // TODO: Implement intervention creation
      console.log('Creating intervention for client:', client, 'with data:', formData);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Intervention creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Créer une fiche d'intervention
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle fiche d'intervention pour {client?.first_name} {client?.last_name}.
          </DialogDescription>
        </DialogHeader>
        
        <InterventionForm
          client={client}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InterventionDialog;