import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { CessionFormData, CessionFormErrors } from '../types';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FleetReservationSelectorProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
}

export const FleetReservationSelector = ({
  formData,
  errors,
  onFieldChange
}: FleetReservationSelectorProps) => {
  const { reservations, isLoading } = useFleetReservations();

  // Filter reservations with insurance info
  const eligibleReservations = (reservations || []).filter(
    res => res.insurance_company_name || res.insurance_email
  );

  const formatReservationDisplay = (reservation: any) => {
    const clientName = reservation.clients 
      ? `${reservation.clients.first_name} ${reservation.clients.last_name}` 
      : 'Client non assigné';
    
    const vehicleInfo = reservation.fleet_vehicles
      ? `${reservation.fleet_vehicles.car_brands?.name || ''} ${reservation.fleet_vehicles.car_models?.name || ''} - ${reservation.fleet_vehicles.license_plate}`
      : 'Véhicule non assigné';
    
    const startDate = reservation.start_date 
      ? format(new Date(reservation.start_date), 'dd/MM/yyyy', { locale: fr }) 
      : '';
    
    const endDate = reservation.expected_return_date 
      ? format(new Date(reservation.expected_return_date), 'dd/MM/yyyy', { locale: fr }) 
      : 'en cours';

    const amount = reservation.quotes?.amount 
      ? `${reservation.quotes.amount.toFixed(2)}€` 
      : (reservation.daily_rate ? `${reservation.daily_rate}€/jour` : 'Montant à définir');
    
    return `${clientName} - ${vehicleInfo} (${startDate} → ${endDate}) - ${amount}`;
  };

  const reservationOptions = eligibleReservations.map(res => ({
    value: res.id,
    label: formatReservationDisplay(res)
  }));

  return (
    <div className="space-y-2">
      <Label htmlFor="fleet_reservation_id">
        Prêt de véhicule <span className="text-red-500">*</span>
      </Label>
      <SearchableSelect
        options={reservationOptions}
        value={formData.fleet_reservation_id || ''}
        onValueChange={(value) => onFieldChange('fleet_reservation_id', value)}
        placeholder={isLoading ? "Chargement..." : "Sélectionner un prêt de véhicule"}
        searchPlaceholder="Rechercher un prêt..."
        disabled={isLoading}
      />
      {eligibleReservations.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground">
          Aucun prêt avec informations d'assurance disponible
        </p>
      )}
      {errors.fleet_reservation_id && (
        <div className="text-sm text-red-600">{errors.fleet_reservation_id}</div>
      )}
    </div>
  );
};
