
import { creditsService } from '@/services/supabase/credits';

export const generateNextCreditNumber = async (): Promise<string> => {
  try {
    const lastCredit = await creditsService.getLastCreditByUser();
    const lastNumber = lastCredit?.reference ? parseInt(lastCredit.reference) : 0;
    return (lastNumber + 1).toString();
  } catch (error) {
    console.error('Error generating credit number:', error);
    return '1';
  }
};
