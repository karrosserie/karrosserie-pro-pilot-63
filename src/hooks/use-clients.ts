import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService, NewClient, UpdateClient } from '@/services/supabase/clients';
import { useToast } from '@/hooks/use-toast';
import { useImpersonation } from '@/hooks/use-impersonation';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';

// Helper function to transform client data from database format to frontend format
const transformClientFromDB = (client: any) => {
  if (!client) return client;
  
  return {
    ...client,
    firstName: client.first_name,
    lastName: client.last_name,
    zipCode: client.postal_code,
    driverLicenseFrontUrl: client.driver_license_front_url || '',
    driverLicenseBackUrl: client.driver_license_back_url || '',
    autoRelancesDisabled: client.auto_relances_disabled || false,
    // Nouveaux champs entreprise
    clientType: client.client_type || 'particulier',
    companyName: client.company_name || '',
    managerIdUrl: client.manager_id_url || '',
    kbisUrl: client.kbis_url || '',
  };
};

export function useClients() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isImpersonating, impersonationData } = useImpersonation();
  const { trackAction } = useDetailedTracking();

  // QueryKey dynamique basée sur l'impersonation - pas besoin d'invalider manuellement
  
  const {
    data: clients,
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients', impersonationData?.company_id || 'normal'],
    queryFn: async () => {
      const data = await clientsService.getAll();
      return data?.map(transformClientFromDB) || [];
    },
    staleTime: 10000, // 10 secondes avant refetch
  });
  
  const createClient = useMutation({
    mutationFn: (newClient: any) => {
      return clientsService.create(newClient);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client créé",
        description: "Le client a été créé avec succès."
      });
      
      // Track client creation
      trackAction('client_created', {
        client_id: data?.id,
        client_name: `${data?.first_name} ${data?.last_name}`,
        email: data?.email,
        phone: data?.phone,
        client_type: data?.client_type
      });
    },
    onError: (error) => {
      console.error('Error creating client:', error);
      toast({
        title: "Erreur",
        description: `Impossible de créer le client: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => {
      return clientsService.update(id, data);
    },
    onSuccess: (updatedData, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès."
      });
      
      // Track client update
      trackAction('client_updated', {
        client_id: id,
        client_name: data?.firstName && data?.lastName ? `${data.firstName} ${data.lastName}` : undefined
      });
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le client: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteClient = useMutation({
    mutationFn: (id: string) => clientsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès."
      });
      
      // Track client deletion
      trackAction('client_deleted', {
        client_id: id
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le client: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient
  };
}

export function useClient(id?: string) {
  const {
    data: client,
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      if (!id) return null;
      const data = await clientsService.getById(id);
      return transformClientFromDB(data);
    },
    enabled: !!id
  });
  
  return {
    client,
    isLoading,
    error
  };
}
