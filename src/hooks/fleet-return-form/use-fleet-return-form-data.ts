
import { useState, useEffect } from 'react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { FleetReturnFormData } from '@/components/fleet/FleetReturnForm.types';
import { getCurrentDateTime, parseDamagesFromReservation, jsonToStringArray } from './utils';

export const useFleetReturnFormData = (
  vehicle: FleetVehicle,
  reservationId: string,
  reservation: any,
  fleetReturn: any
) => {
  const [formData, setFormData] = useState<FleetReturnFormData>({
    reservationId,
    vehicleId: vehicle.id,
    clientId: '',
    returnDate: getCurrentDateTime(),
    returnMileage: vehicle.mileage || 0,
    fuelLevelReturn: 100,
    vehicleImages: [],
    damages: [],
    notes: '',
    attestationAccepted: false,
    clientSignature: '',
    clientName: ''
  });

  // Update form data when reservation data is loaded
  useEffect(() => {
    if (reservation) {
      setFormData(prev => ({
        ...prev,
        clientId: reservation.client_id || '',
        clientName: reservation.clients ? `${reservation.clients.first_name} ${reservation.clients.last_name}` : '',
        damages: parseDamagesFromReservation(reservation.damages),
        returnMileage: reservation.start_mileage || vehicle.mileage || 0
      }));
    }
  }, [reservation, vehicle.mileage]);

  // Update form data when fleet return data is loaded (for viewing existing returns)
  useEffect(() => {
    if (fleetReturn && reservation) {
      setFormData(prev => ({
        ...prev,
        clientId: reservation.client_id || '',
        clientName: reservation.clients ? `${reservation.clients.first_name} ${reservation.clients.last_name}` : '',
        returnDate: fleetReturn.return_date || getCurrentDateTime(),
        returnMileage: fleetReturn.return_mileage || 0,
        fuelLevelReturn: fleetReturn.fuel_level_return || 100,
        vehicleImages: jsonToStringArray(fleetReturn.vehicle_images),
        damages: parseDamagesFromReservation(fleetReturn.damages),
        notes: fleetReturn.notes || '',
        attestationAccepted: fleetReturn.attestation_accepted || false,
        clientSignature: fleetReturn.client_signature || '',
      }));
    }
  }, [fleetReturn, reservation]);

  return { formData, setFormData };
};
