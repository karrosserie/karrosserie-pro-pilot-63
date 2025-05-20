
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expertiseReportsService, NewExpertiseReport, UpdateExpertiseReport } from '@/services/supabase/expertise-reports';
import { useToast } from '@/hooks/use-toast';

export function useExpertiseReports() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: reports,
    isLoading,
    error
  } = useQuery({
    queryKey: ['expertiseReports'],
    queryFn: expertiseReportsService.getAll
  });
  
  const createReport = useMutation({
    mutationFn: (newReport: NewExpertiseReport) => expertiseReportsService.create(newReport),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
      toast({
        title: "Rapport d'expertise créé",
        description: "Le rapport d'expertise a été créé avec succès."
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
    mutationFn: ({ id, data }: { id: string, data: UpdateExpertiseReport }) => 
      expertiseReportsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
      toast({
        title: "Rapport d'expertise mis à jour",
        description: "Le rapport d'expertise a été mis à jour avec succès."
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
      toast({
        title: "Rapport d'expertise supprimé",
        description: "Le rapport d'expertise a été supprimé avec succès."
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
