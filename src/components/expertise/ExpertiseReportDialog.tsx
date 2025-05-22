
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
      } else {
        await createReport.mutateAsync(formData as any);
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de ${report ? 'mettre à jour' : 'créer'} le PV d'expertise: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{report ? "Modifier le PV d'expertise" : "Ajouter un PV d'expertise"}</DialogTitle>
          <DialogDescription>
            {report
              ? "Modifiez les détails du procès verbal d'expertise."
              : "Ajoutez un nouveau procès verbal d'expertise."
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
