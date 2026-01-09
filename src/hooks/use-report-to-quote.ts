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
  const checkConvertedStatus = async (reportId: string, reportUpdatedAt?: string) => {
    try {
      const existingQuote = await quotesService.getByReportId(reportId);
      if (existingQuote) {
        // Si le rapport a été mis à jour après la création du devis, autoriser la reconversion
        if (reportUpdatedAt && existingQuote.created_at) {
          const reportDate = new Date(reportUpdatedAt);
          const quoteDate = new Date(existingQuote.created_at);
          if (reportDate > quoteDate) {
            // Le rapport a été modifié après le devis, permettre la reconversion
            return false;
          }
        }
        setConvertedReports(prev => ({ ...prev, [reportId]: existingQuote }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking converted status:', error);
      return false;
    }
  };

  // Vérifier le statut de conversion pour plusieurs rapports en UNE SEULE requête
  const checkMultipleReports = async (reports: ExpertiseReport[]) => {
    if (!reports || reports.length === 0) {
      setConvertedReports({});
      return {};
    }
    
    // Utiliser une requête batch au lieu de N requêtes individuelles
    const reportIds = reports.map(r => r.id);
    const quotesMap = await quotesService.getByReportIds(reportIds);
    
    // Filtrer: ne marquer comme "converti" que si le rapport n'a pas été modifié après le devis
    const filteredResults: Record<string, any> = {};
    for (const report of reports) {
      const quote = quotesMap[report.id];
      if (quote) {
        // Vérifier si le rapport a été modifié après la création du devis
        const reportDate = new Date(report.updated_at);
        const quoteDate = new Date(quote.created_at);
        if (reportDate <= quoteDate) {
          // Le rapport n'a pas été modifié après le devis, le marquer comme converti
          filteredResults[report.id] = quote;
        }
        // Sinon, ne pas l'inclure = le bouton Convertir sera actif
      }
    }
    
    setConvertedReports(filteredResults);
    return filteredResults;
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

    // Vérifier si déjà converti (en tenant compte de la date de mise à jour)
    const isAlreadyConverted = await checkConvertedStatus(report.id, report.updated_at);
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