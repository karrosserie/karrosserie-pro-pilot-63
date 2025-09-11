import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Calendar, User, FileText, Download } from 'lucide-react';

interface FleetLoansMobileCardProps {
  reservation: any;
  onViewLoan?: (loanId: string) => void;
  onViewReturn?: (loanId: string) => void;
  onDownloadLoanAttestation?: (loanId: string) => void;
  onDownloadReturnAttestation?: (loanId: string) => void;
}

export const FleetLoansMobileCard = ({ 
  reservation,
  onViewLoan,
  onViewReturn,
  onDownloadLoanAttestation,
  onDownloadReturnAttestation
}: FleetLoansMobileCardProps) => {
  const getVehicleDisplayName = (fleetVehicle: any) => {
    if (fleetVehicle?.car_brands?.name && fleetVehicle?.car_models?.name) {
      return `${fleetVehicle.car_brands.name} ${fleetVehicle.car_models.name}`;
    }
    return 'Véhicule non spécifié';
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Car className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-card-foreground">
            {getVehicleDisplayName(reservation.fleet_vehicles)}
          </h3>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>
            {reservation.clients?.first_name} {reservation.clients?.last_name}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Du {new Date(reservation.start_date).toLocaleDateString('fr-FR')}</span>
          </div>
          <span>
            au {reservation.actual_return_date 
              ? new Date(reservation.actual_return_date).toLocaleDateString('fr-FR')
              : new Date(reservation.expected_return_date).toLocaleDateString('fr-FR')
            }
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDownloadLoanAttestation?.(reservation.id)}
          title="Attestation de prêt"
        >
          <FileText className="h-4 w-4 mr-1" />
          Prêt
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDownloadReturnAttestation?.(reservation.id)}
          title="Attestation de retour"
        >
          <Download className="h-4 w-4 mr-1" />
          Retour
        </Button>
      </div>
    </div>
  );
};