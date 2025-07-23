import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interventionSheetsService } from '@/services/supabase/intervention-sheets';
import { NewInterventionSheet, UpdateInterventionSheet } from '@/services/supabase/intervention-sheets/types';
import { toast } from 'sonner';

export function useInterventionSheets() {
  return useQuery({
    queryKey: ['intervention-sheets'],
    queryFn: interventionSheetsService.getAll,
  });
}

export function useInterventionSheetsByClient(clientId: string) {
  return useQuery({
    queryKey: ['intervention-sheets', 'client', clientId],
    queryFn: () => interventionSheetsService.getByClientId(clientId),
    enabled: !!clientId,
  });
}

export function useInterventionSheet(id: string) {
  return useQuery({
    queryKey: ['intervention-sheets', id],
    queryFn: () => interventionSheetsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateInterventionSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sheet: NewInterventionSheet) => interventionSheetsService.create(sheet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intervention-sheets'] });
      toast.success('Fiche d\'intervention créée avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la création de la fiche d\'intervention');
      console.error('Error creating intervention sheet:', error);
    },
  });
}

export function useUpdateInterventionSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInterventionSheet }) =>
      interventionSheetsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intervention-sheets'] });
      toast.success('Fiche d\'intervention mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la mise à jour de la fiche d\'intervention');
      console.error('Error updating intervention sheet:', error);
    },
  });
}

export function useDeleteInterventionSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => interventionSheetsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intervention-sheets'] });
      toast.success('Fiche d\'intervention supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la suppression de la fiche d\'intervention');
      console.error('Error deleting intervention sheet:', error);
    },
  });
}