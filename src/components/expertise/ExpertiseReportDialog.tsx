
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpertiseReportForm } from '@/components/expertise/ExpertiseReportForm';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { useToast } from '@/hooks/use-toast';

interface ExpertiseReportDialogProps {
  report?: ExpertiseReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExpertiseReportDialog = ({
  report,
  open,
  onOpenChange
}: ExpertiseReportDialogProps) => {
  const { toast } = useToast();
  const { updateReport, createReport } = useExpertiseReports();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: Partial<ExpertiseReport>) => {
    setIsSubmitting(true);
    
    try {
      if (report && report.id) {
        await updateReport.mutateAsync({ id: report.id, data: formData });
        toast({
          title: "Rapport mis à jour",
          description: "Le rapport d'expertise a été mis à jour avec succès."
        });
      } else {
        await createReport.mutateAsync(formData as any);
        toast({
          title: "Rapport créé",
          description: "Le nouveau rapport d'expertise a été créé avec succès."
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de ${report ? 'mettre à jour' : 'créer'} le rapport d'expertise: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {report ? `Modifier le rapport d'expertise - ${report.reference}` : "Créer un nouveau rapport d'expertise"}
          </DialogTitle>
          <DialogDescription>
            {report
              ? "Modifiez les détails du rapport d'expertise."
              : "Créez un nouveau rapport d'expertise en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <ExpertiseReportForm
          report={report}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpertiseReportDialog;
