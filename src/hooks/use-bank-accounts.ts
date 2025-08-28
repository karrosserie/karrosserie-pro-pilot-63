import { useQuery } from '@tanstack/react-query';
import { bankAccountsService } from '@/services/supabase/bank-accounts';

export function useBankAccounts() {
  const {
    data: bankAccounts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: bankAccountsService.getAll
  });
  
  return {
    bankAccounts: bankAccounts || [],
    isLoading,
    error
  };
}