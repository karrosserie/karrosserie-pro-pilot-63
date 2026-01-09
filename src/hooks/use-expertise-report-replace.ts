import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expertiseReportsService } from '@/services/supabase/expertise-reports';
import { useToast } from '@/hooks/use-toast';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';

interface ReplaceReportParams {
  reportId: string;
  newDocumentUrl: string;
  oldDocumentUrl: string | null;
  documentName: string;
}

export function useExpertiseReportReplace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { trackAction } = useDetailedTracking();
  
  const replaceReport = useMutation({
    mutationFn: async ({ 
      reportId, 
      newDocumentUrl, 
      oldDocumentUrl
    }: ReplaceReportParams) => {
      return await expertiseReportsService.replaceDocument(
        reportId, 
        newDocumentUrl, 
        oldDocumentUrl
      );
    },
    onSuccess: (data, variables) => {
      // Invalider les rapports ET les quotes pour permettre la reconversion
      queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Rapport modifié",
        description: "Le nouveau document est en cours d'analyse."
      });
      
      // Track the replacement action
      trackAction('expertise_report_updated', {
        report_id: variables.reportId,
        document_name: variables.documentName,
        action_type: 'document_replaced'
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Impossible de remplacer le rapport: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const checkDependencies = async (reportId: string) => {
    return await expertiseReportsService.checkDependencies(reportId);
  };
  
  return {
    replaceReport,
    checkDependencies,
    isReplacing: replaceReport.isPending
  };
}
