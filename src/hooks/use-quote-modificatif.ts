import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { quotesService } from '@/services/supabase/quotes';

export const useQuoteModificatif = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRequesting, setIsRequesting] = useState(false);

  const markAsModified = async (quoteId: string) => {
    try {
      await quotesService.update(quoteId, {
        is_modified_from_report: true,
        modificatif_requested_at: new Date().toISOString()
      });
      
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      toast({
        title: "Devis marqué comme modifié",
        description: "Le devis a été marqué comme nécessitant un rapport modificatif."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de marquer le devis: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const requestModificatif = async (quoteId: string, expertEmail?: string, expertPhone?: string) => {
    setIsRequesting(true);
    try {
      // Marquer comme modifié avec date de demande
      await quotesService.update(quoteId, {
        is_modified_from_report: true,
        modificatif_requested_at: new Date().toISOString()
      });
      
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      toast({
        title: "Demande envoyée",
        description: "La demande de rapport modificatif a été enregistrée. Contactez l'expert pour obtenir le document."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer la demande: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  const attachModificatif = async (quoteId: string, modificatifReportId: string) => {
    try {
      await quotesService.update(quoteId, {
        modificatif_report_id: modificatifReportId,
        modificatif_received_at: new Date().toISOString()
      });
      
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      toast({
        title: "Rapport modificatif associé",
        description: "Le rapport modificatif a été associé au devis avec succès."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'associer le rapport: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return {
    markAsModified,
    requestModificatif,
    attachModificatif,
    isRequesting
  };
};
