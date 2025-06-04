
import { quotesService } from '@/services/supabase/quotes';

export const generateNextQuoteNumber = async (): Promise<string> => {
  try {
    const lastQuote = await quotesService.getLastQuoteByUser();
    const lastNumber = lastQuote?.reference ? parseInt(lastQuote.reference) : 0;
    return (lastNumber + 1).toString();
  } catch (error) {
    console.error('Error generating quote number:', error);
    return '1';
  }
};
