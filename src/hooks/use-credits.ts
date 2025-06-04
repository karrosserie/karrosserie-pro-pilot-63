
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Mock data for now since the credits table doesn't exist yet
const mockCredits = [
  {
    id: '1',
    reference: '001',
    created_at: '2024-01-15T10:00:00Z',
    amount: 250.50,
    status: 'En attente',
    invoice_id: 'invoice-1',
    notes: 'Remboursement partiel',
    user_id: 'user-1'
  }
];

export function useCredits() {
  const { toast } = useToast();
  
  const {
    data: credits,
    isLoading,
    error
  } = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCredits;
    }
  });
  
  const createCredit = {
    mutateAsync: async (creditData: any) => {
      console.log('Creating credit:', creditData);
      // Simulation de création
      return { id: Date.now().toString(), ...creditData };
    },
    isPending: false
  };
  
  const updateCredit = {
    mutateAsync: async ({ id, data }: { id: string, data: any }) => {
      console.log('Updating credit:', id, data);
      return { id, ...data };
    }
  };
  
  const deleteCredit = {
    mutateAsync: async (id: string) => {
      console.log('Deleting credit:', id);
      return true;
    }
  };
  
  return {
    credits,
    isLoading,
    error,
    createCredit,
    updateCredit,
    deleteCredit
  };
}

export function useCredit(id?: string) {
  const {
    data: credit,
    isLoading,
    error
  } = useQuery({
    queryKey: ['credits', id],
    queryFn: async () => {
      if (!id) return null;
      // Simulation d'une requête par ID
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCredits.find(c => c.id === id) || null;
    },
    enabled: !!id
  });
  
  return {
    credit,
    isLoading,
    error
  };
}
