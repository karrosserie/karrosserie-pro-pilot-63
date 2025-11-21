import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fleetReservationsService } from '@/services/supabase/fleet-reservations';
import { ToastAction } from '@/components/ui/toast';

interface Quote {
  id: string;
  client_id: string;
  reference: string;
}

interface UseQuoteToReservationLinkerProps {
  createdQuote: Quote | null;
  onLinkComplete?: () => void;
}

export const useQuoteToReservationLinker = ({ 
  createdQuote, 
  onLinkComplete 
}: UseQuoteToReservationLinkerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!createdQuote) return;

    const checkPendingReservations = async () => {
      try {
        const activeReservationsWithoutQuote = await fleetReservationsService.getActiveWithoutQuote(
          createdQuote.client_id
        );

        if (activeReservationsWithoutQuote.length > 0) {
          const reservation = activeReservationsWithoutQuote[0];
          const vehicleDisplay = reservation.fleet_vehicles?.car_brands?.name && reservation.fleet_vehicles?.car_models?.name
            ? `${reservation.fleet_vehicles.car_brands.name} ${reservation.fleet_vehicles.car_models.name} - ${reservation.fleet_vehicles.license_plate}`
            : `Véhicule ${reservation.fleet_vehicles?.license_plate || ''}`;

          const handleLink = async () => {
            try {
              await fleetReservationsService.update(reservation.id, {
                quote_id: createdQuote.id
              });
              
              toast({
                title: "Liaison effectuée",
                description: `Le devis ${createdQuote.reference} a été lié au prêt.`,
              });
              
              onLinkComplete?.();
            } catch (error) {
              console.error('Error linking quote to reservation:', error);
              toast({
                title: "Erreur",
                description: "Impossible de lier le devis au prêt.",
                variant: "destructive"
              });
            }
          };

          toast({
            title: "Prêt actif sans devis détecté",
            description: `Ce client a un prêt actif sans devis de facturation (${vehicleDisplay}). Voulez-vous lier ce devis ?`,
            action: (
              <ToastAction altText="Lier maintenant" onClick={handleLink}>
                Lier maintenant
              </ToastAction>
            ),
          });
        }
      } catch (error) {
        console.error('Error checking pending reservations:', error);
      }
    };

    checkPendingReservations();
  }, [createdQuote, toast, onLinkComplete]);
};
