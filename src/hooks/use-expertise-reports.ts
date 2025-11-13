
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expertiseReportsService, NewExpertiseReport, UpdateExpertiseReport, ExpertiseReport } from '@/services/supabase/expertise-reports';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';

export function useExpertiseReports() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { trackAction } = useDetailedTracking();
  
  const {
    data: reports,
    isLoading,
    error
  } = useQuery({
    queryKey: ['expertiseReports'],
    queryFn: expertiseReportsService.getAll,
    staleTime: 0, // Considérer les données comme obsolètes immédiatement
    refetchOnWindowFocus: true, // Refetch quand la fenêtre reprend le focus
  });

  // Temporarily disable realtime to prevent WebSocket browser compatibility issues
  // TODO: Re-implement with proper browser WebSocket handling
  // useEffect(() => {
  //   const reportsChannel = supabase
  //     .channel('expertise-reports-realtime')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'expertise_reports'
  //       },
  //       (payload) => {
  //         console.log('Expertise report updated:', payload);
  //         queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
  //       }
  //     )
  //     .subscribe();

  //   const quotesChannel = supabase
  //     .channel('quotes-realtime')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: 'INSERT',
  //         schema: 'public',
  //         table: 'quotes'
  //       },
  //       (payload) => {
  //         console.log('Quote created:', payload);
  //         queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(reportsChannel);
  //     supabase.removeChannel(quotesChannel);
  //   };
  // }, [queryClient]);
  
  const createReport = useMutation({
    mutationFn: (newReport: NewExpertiseReport) => expertiseReportsService.create(newReport),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
      toast({
        title: "Rapport d'expertise en cours d'analyse...",
        description: "Le rapport d'expertise a été soumis et est maintenant en cours d'analyse par notre IA."
      });
      
      // Track expertise report creation
      trackAction('expertise_report_created', {
        report_id: data?.id,
        report_number: data?.report_number,
        status: data?.status
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer le rapport d'expertise: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateReport = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<ExpertiseReport> }) => 
      expertiseReportsService.update(id, data as UpdateExpertiseReport),
    onSuccess: (updatedData, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
      toast({
        title: "Rapport d'expertise mis à jour",
        description: "Le rapport d'expertise a été mis à jour avec succès."
      });
      
      // Track expertise report update
      trackAction('expertise_report_updated', {
        report_id: id,
        report_number: data?.report_number || updatedData?.report_number
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le rapport d'expertise: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteReport = useMutation({
    mutationFn: (id: string) => expertiseReportsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
      toast({
        title: "Rapport d'expertise supprimé",
        description: "Le rapport d'expertise a été supprimé avec succès."
      });
      
      // Track expertise report deletion
      trackAction('expertise_report_deleted', {
        report_id: id
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le rapport d'expertise: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    reports,
    isLoading,
    error,
    createReport,
    updateReport,
    deleteReport
  };
}

export function useExpertiseReport(id?: string) {
  const {
    data: report,
    isLoading,
    error
  } = useQuery({
    queryKey: ['expertiseReports', id],
    queryFn: () => id ? expertiseReportsService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    report,
    isLoading,
    error
  };
}
