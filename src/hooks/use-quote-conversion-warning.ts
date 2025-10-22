import { useEffect, useState } from 'react';
import { quotesService, Quote } from '@/services/supabase/quotes';

const STORAGE_KEY = 'lastQuoteWarningDate';

export function useQuoteConversionWarning() {
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const [unconvertedQuotes, setUnconvertedQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkForUnconvertedQuotes();
  }, []);

  const checkForUnconvertedQuotes = async () => {
    try {
      setIsLoading(true);

      // Vérifier la dernière date d'alerte
      const lastWarningDate = localStorage.getItem(STORAGE_KEY);
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

      // Si l'alerte a déjà été affichée aujourd'hui, ne pas montrer
      if (lastWarningDate === today) {
        setShouldShowWarning(false);
        setIsLoading(false);
        return;
      }

      // Récupérer les devis non convertis créés depuis des rapports
      const quotes = await quotesService.getUnconvertedQuotesFromReports();
      
      if (quotes && quotes.length > 0) {
        setUnconvertedQuotes(quotes);
        setShouldShowWarning(true);
      } else {
        setShouldShowWarning(false);
      }
    } catch (error) {
      console.error('Error checking for unconverted quotes:', error);
      setShouldShowWarning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissWarning = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEY, today);
    setShouldShowWarning(false);
  };

  return {
    shouldShowWarning,
    unconvertedQuotes,
    isLoading,
    dismissWarning,
  };
}
