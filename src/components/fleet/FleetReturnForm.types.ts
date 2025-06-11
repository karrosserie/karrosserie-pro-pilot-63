
export interface FleetReturnFormData {
  reservationId: string;
  vehicleId: string;
  clientId: string;
  returnDate: string;
  returnMileage: number;
  fuelLevelReturn: number;
  vehicleImages: string[];
  damages: DamageItem[];
  notes: string;
  attestationAccepted: boolean;
  clientSignature: string;
  clientName: string;
}

export interface DamageItem {
  id: string;
  type: string;
  description: string;
  severity: 'light' | 'moderate' | 'severe';
  location: string;
  images: string[];
}
