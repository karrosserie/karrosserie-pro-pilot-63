
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { useIsMobile } from '@/hooks/use-mobile';
import { FleetLoansMobileCard } from './FleetLoansMobileCard';

interface FleetLoansHistoryProps {
  onViewLoan?: (loanId: string) => void;
  onViewReturn?: (loanId: string) => void;
}

const FleetLoansHistory: React.FC<FleetLoansHistoryProps> = ({ onViewLoan, onViewReturn }) => {
  const { reservations, isLoading } = useFleetReservations();
  const isMobile = useIsMobile(); // MUST be called before any conditional returns

  // Filter for completed/past reservations
  const completedReservations = (reservations || [])
    .filter(reservation => reservation.status === 'completed' || reservation.status === 'returned')
    .slice(0, 10); // Show only the 10 most recent

  const getVehicleDisplayName = (fleetVehicle: any) => {
    if (fleetVehicle?.car_brands?.name && fleetVehicle?.car_models?.name) {
      return `${fleetVehicle.car_brands.name} ${fleetVehicle.car_models.name}`;
    }
    return 'Véhicule non spécifié';
  };

  if (isLoading) {
    return (
      <div className="card-container">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Historique des prêts</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Historique des prêts</h2>
      
      {isMobile ? (
        <div className="space-y-4">
          {completedReservations.length > 0 ? (
            completedReservations.map((reservation) => (
              <FleetLoansMobileCard
                key={reservation.id}
                reservation={reservation}
                onViewLoan={onViewLoan}
                onViewReturn={onViewReturn}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Aucun historique de prêt trouvé
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Véhicule</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date de début</th>
                <th className="px-4 py-3">Date de fin</th>
                <th className="px-4 py-3 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {completedReservations.length > 0 ? (
                completedReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {getVehicleDisplayName(reservation.fleet_vehicles)}
                    </td>
                    <td className="px-4 py-3">
                      {reservation.clients?.first_name} {reservation.clients?.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(reservation.start_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {reservation.actual_return_date 
                        ? new Date(reservation.actual_return_date).toLocaleDateString('fr-FR')
                        : new Date(reservation.expected_return_date).toLocaleDateString('fr-FR')
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewLoan?.(reservation.id)}
                        >
                          Sortie
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewReturn?.(reservation.id)}
                        >
                          Retour
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Aucun historique de prêt trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FleetLoansHistory;
