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
import { interventionSheetsService } from '@/services/supabase/intervention-sheets';
import { toast } from 'sonner';

interface InterventionDialogProps {
  client?: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSheet?: any;
  preselectedVehicle?: any;
}

const InterventionDialog = ({
  client,
  open,
  onOpenChange,
  existingSheet,
  preselectedVehicle
}: InterventionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (existingSheet) {
        await interventionSheetsService.update(existingSheet.id, {
          carrosserie_reports: formData.carrosserie_reports,
          mecanique_reports: formData.mecanique_reports,
          electrique_reports: formData.electrique_reports,
          is_approved: formData.is_approved,
        });
        toast.success('Fiche d\'intervention mise à jour avec succès');
      } else {
        await interventionSheetsService.create({
          client_id: formData.client_id,
          vehicle_id: formData.vehicle_id,
          carrosserie_reports: formData.carrosserie_reports,
          mecanique_reports: formData.mecanique_reports,
          electrique_reports: formData.electrique_reports,
          is_approved: formData.is_approved,
        });
        toast.success('Fiche d\'intervention créée avec succès');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error('Erreur lors de la création de la fiche d\'intervention');
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
            {existingSheet ? 'Modifier la fiche d\'intervention' : 'Créer une fiche d\'intervention'}
          </DialogTitle>
        </DialogHeader>
        
        <InterventionForm
          client={client}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          existingSheet={existingSheet}
          preselectedVehicle={preselectedVehicle}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InterventionDialog;