import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetReservationsService, NewFleetReservation, UpdateFleetReservation } from '@/services/supabase/fleet-reservations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useFleetReservations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: reservations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReservations'],
    queryFn: fleetReservationsService.getAll
  });
  
  const createReservation = useMutation({
    mutationFn: (newReservation: NewFleetReservation) => fleetReservationsService.create(newReservation),
    onSuccess: async (newReservation) => {
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
      
      // Si un email d'assurance est renseigné, envoyer la notification automatiquement
      if (newReservation.insurance_email) {
        try {
          const clientName = `${newReservation.clients.first_name} ${newReservation.clients.last_name}`;
          
          console.log('📧 Envoi notification assurance pour:', clientName);
          
          const { data, error } = await supabase.functions.invoke(
            'send-insurance-loan-notification',
            {
              body: {
                reservationId: newReservation.id,
                clientName,
                clientEmail: newReservation.clients.email || '',
                insuranceEmail: newReservation.insurance_email,
                insuranceCompanyName: newReservation.insurance_company_name || '',
                insuranceContractNumber: newReservation.insurance_contract_number
              }
            }
          );
          
          if (error) {
            console.error('❌ Erreur notification assurance:', error);
          } else {
            console.log('✅ Notification envoyée à:', newReservation.insurance_email);
          }
        } catch (error) {
          console.error('❌ Erreur lors de l\'envoi de la notification:', error);
          // Ne pas bloquer la création du prêt si l'email échoue
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer le prêt: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateReservation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateFleetReservation }) => 
      fleetReservationsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
      // Pas de toast pour la mise à jour
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la réservation: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteReservation = useMutation({
    mutationFn: (id: string) => fleetReservationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleetReservations'] });
      // Pas de toast pour la suppression
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la réservation: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    reservations,
    isLoading,
    error,
    createReservation,
    updateReservation,
    deleteReservation
  };
}

export function useFleetReservation(id?: string) {
  const {
    data: reservation,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReservations', id],
    queryFn: () => id ? fleetReservationsService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    reservation,
    isLoading,
    error
  };
}

export function useVehicleReservations(vehicleId?: string) {
  const {
    data: reservations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fleetReservations', 'vehicle', vehicleId],
    queryFn: () => vehicleId ? fleetReservationsService.getByVehicleId(vehicleId) : [],
    enabled: !!vehicleId
  });
  
  return {
    reservations,
    isLoading,
    error
  };
}
