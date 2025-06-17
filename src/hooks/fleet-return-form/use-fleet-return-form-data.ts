
import { useState, useEffect } from 'react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { FleetReservation } from '@/services/supabase/fleet-reservations';
import { FleetReturn } from '@/services/supabase/fleet-returns';
import { FleetReturnFormData } from '@/components/fleet/FleetReturnForm.types';

interface VehicleImage {
  url: string;
  phase: 'Avant' | 'Pendant' | 'Après';
}

export const useFleetReturnFormData = (
  vehicle: FleetVehicle,
  reservationId: string,
  reservation?: FleetReservation | null,
  fleetReturn?: FleetReturn | null
) => {
  const [formData, setFormData] = useState<FleetReturnFormData>({
    reservationId,
    vehicleId: vehicle.id,
    clientId: '',
    returnDate: new Date().toISOString().slice(0, 16),
    returnMileage: 0,
    fuelLevelReturn: 0,
    vehicleImages: [] as VehicleImage[],
    damages: [],
    notes: '',
    attestationAccepted: false,
    clientSignature: '',
    clientName: ''
  });

  // Update form data when reservation or return data is loaded
  useEffect(() => {
    if (reservation) {
      setFormData(prev => ({
        ...prev,
        clientId: reservation.client_id || '',
        clientName: reservation.client_name || ''
      }));
    }
  }, [reservation]);

  useEffect(() => {
    if (fleetReturn) {
      setFormData(prev => ({
        ...prev,
        returnDate: fleetReturn.return_date || prev.returnDate,
        returnMileage: fleetReturn.return_mileage || 0,
        fuelLevelReturn: fleetReturn.fuel_level_return || 0,
        vehicleImages: (fleetReturn.vehicle_images as VehicleImage[]) || [],
        damages: fleetReturn.damages || [],
        notes: fleetReturn.notes || '',
        attestationAccepted: fleetReturn.attestation_accepted || false,
        clientSignature: fleetReturn.client_signature || '',
        clientName: fleetReturn.client_name || prev.clientName
      }));
    }
  }, [fleetReturn]);

  return { formData, setFormData };
};
