
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
import { useIsMobile } from '@/hooks/use-mobile';

interface ExpertiseReportDialogProps {
  report?: ExpertiseReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isViewMode?: boolean;
}

const ExpertiseReportDialog = ({
  report,
  open,
  onOpenChange,
  isViewMode = false
}: ExpertiseReportDialogProps) => {
  const { toast } = useToast();
  const { updateReport, createReport } = useExpertiseReports();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (formData: Partial<ExpertiseReport>) => {
    setIsSubmitting(true);
    
    try {
      if (report && report.id) {
        await updateReport.mutateAsync({ id: report.id, data: formData });
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
      <DialogContent className={`${
        isMobile 
          ? 'w-[95vw] h-[90vh] max-w-none max-h-none m-2' 
          : 'max-w-4xl max-h-[90vh]'
      } overflow-hidden`}>
        <DialogHeader className={isMobile ? 'px-2' : ''}>
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
            {isViewMode
              ? "Visualiser le rapport d'expertise"
              : report 
                ? "Modifier le rapport d'expertise" 
                : "Créer un nouveau rapport d'expertise"
            }
          </DialogTitle>
          <DialogDescription className={`${isMobile ? 'text-sm' : ''}`}>
            {isViewMode
              ? "Consultez les détails du rapport d'expertise."
              : report
                ? "Modifiez les détails du rapport d'expertise."
                : "Créez un nouveau rapport d'expertise en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className={`${isMobile ? 'px-2' : ''} flex-1 overflow-hidden`}>
          <ExpertiseReportForm
            report={report}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertiseReportDialog;
