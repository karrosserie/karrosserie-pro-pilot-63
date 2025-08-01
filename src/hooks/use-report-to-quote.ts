import { useState, useEffect } from 'react';
import { quotesService } from '@/services/supabase/quotes';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

export const useReportToQuote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [convertingReportId, setConvertingReportId] = useState<string | null>(null);
  const [convertedReports, setConvertedReports] = useState<Record<string, any>>({});

  // Vérifier si un rapport a déjà été converti en devis
  const checkConvertedStatus = async (reportId: string) => {
    try {
      const existingQuote = await quotesService.getByReportId(reportId);
      if (existingQuote) {
        setConvertedReports(prev => ({ ...prev, [reportId]: existingQuote }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking converted status:', error);
      return false;
    }
  };

  // Vérifier le statut de conversion pour plusieurs rapports (maintenant synchrone pour le chargement initial)
  const checkMultipleReports = async (reports: ExpertiseReport[]) => {
    const results: Record<string, any> = {};
    
    // Utiliser Promise.all pour charger tous les statuts en parallèle
    const promises = reports.map(async (report) => {
      try {
        const existingQuote = await quotesService.getByReportId(report.id);
        if (existingQuote) {
          results[report.id] = existingQuote;
        }
      } catch (error) {
        console.error(`Error checking report ${report.id}:`, error);
      }
    });
    
    await Promise.all(promises);
    setConvertedReports(results);
    return results;
  };

  // Convertir un rapport d'expertise en devis
  const convertToQuote = async (report: ExpertiseReport) => {
    if (!report.client_id || !report.vehicle_id) {
      toast({
        title: "Erreur",
        description: "Le rapport doit avoir un client et un véhicule assignés pour être converti en devis.",
        variant: "destructive"
      });
      return null;
    }

    // Vérifier si déjà converti
    const isAlreadyConverted = await checkConvertedStatus(report.id);
    if (isAlreadyConverted) {
      toast({
        title: "Information",
        description: "Ce rapport a déjà été converti en devis.",
        variant: "default"
      });
      return null;
    }

    setConvertingReportId(report.id);

    try {
      const newQuote = await quotesService.createFromReport(report);
      
      // Mettre à jour l'état local
      setConvertedReports(prev => ({ ...prev, [report.id]: newQuote }));
      
      // Invalider le cache des devis pour rafraîchir l'affichage
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      toast({
        title: "Conversion réussie",
        description: `Le rapport ${report.report_number} a été converti en devis ${newQuote.reference}.`
      });

      // Rediriger vers la page des devis avec l'ID du nouveau devis
      navigate(`/documents/devis?openQuote=${newQuote.id}`);

      return newQuote;
    } catch (error: any) {
      console.error('Error converting report to quote:', error);
      toast({
        title: "Erreur",
        description: `Impossible de convertir le rapport: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setConvertingReportId(null);
    }
  };

  // Vérifier si un rapport est en cours de conversion
  const isConverting = (reportId: string) => convertingReportId === reportId;

  // Vérifier si un rapport a été converti
  const isConverted = (reportId: string) => !!convertedReports[reportId];

  // Obtenir le devis associé à un rapport
  const getQuoteForReport = (reportId: string) => convertedReports[reportId];

  return {
    convertToQuote,
    checkConvertedStatus,
    checkMultipleReports,
    isConverting,
    isConverted,
    getQuoteForReport,
    convertedReports
  };
};